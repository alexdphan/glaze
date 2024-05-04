import os
from io import BytesIO
from typing import IO
import uuid
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import JSONResponse, StreamingResponse
from dotenv import load_dotenv
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware
import boto3
from botocore.exceptions import NoCredentialsError
import uvicorn

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

if not ELEVENLABS_API_KEY:
    raise ValueError("ELEVENLABS_API_KEY environment variable not set")

el_client = ElevenLabs(api_key=ELEVENLABS_API_KEY, timeout=10000)

client = Groq(
    base_url="https://api.groq.com",
    api_key=os.environ.get("GROQ_API_KEY"),
)

s3 = boto3.client('s3',
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
)

aws_bucket_name = os.environ.get("AWS_BUCKET_NAME")
aws_bucket_region = os.environ.get("AWS_BUCKET_REGION")

app = FastAPI()

# origins is the list of origins that the API will allow (the frontend)
origins = ["http://localhost:3000", "https://glaze-two.vercel.app", "https://www.glazedai.com", "https://glazedai.com"]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains temporarily
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthcheck")
def healthcheck():
    return {"status": "ok"}


@app.post("/generate")
async def generate(request: Request):
    try:

        data = await request.json()
        user_name = data["name"]
        user_description = data["description"]
        user_intent = "glaze"  # Placeholder, replace with actual logic
        
        EXAMPLE = "Boy oh boy, where do I even begin? LeBron, honey, my pookie bear, I have loved you ever since I first laid eyes on you. The way you drive into the paint and strike fear into your enemies' eyes, your silky smooth touch around the rim, and that gorgeous jumpshot - I would do anything for you. I wish it were possible to freeze time so I would never have to watch you retire. You had a rough childhood, but you never gave up hope. You are even amazing off the court; you're a great husband and father. Sometimes I even call you dad. I forever dread and weep, thinking of the day you will one day retire. I would sacrifice my own life if it were the only thing that could put a smile on your beautiful face. You have given me so much joy and heartbreak over the years. I remember when you first left Cleveland, and it's like my heart got broken into a million pieces. But a tear still fell from my right eye when I watched you win your first ring in Miami because, deep down, my glorious king deserved it. I just wanted you to return home. Then, alas, you did. My sweet baby boy came home, and I rejoiced. 2015 was a hard year for us, baby, but in 2016, you made history happen. You came back from 3-1, and I couldn't believe it. I was crying, bawling even, and I heard my glorious king exclaim these words: 'CLEVELAND, THIS IS FOR YOU!' Not only have you changed the game of basketball and the world forever, but you've eternally changed my world. And now, you're getting older but still the GOAT, my GOAT. I love you, pookie bear, my glorious king, LeBron James."

        response = client.chat.completions.create(
            messages=[
                {
                    'role': 'user',
                    'content': f"You are the biggest suck up in the world as a student that is congratulating a senior. You are a huge geek with a huge amount of time on the internet. Describe the personality, person, lifestyle, etc of {user_name} as if your life revolves around this person. Make it snarky and funny. Don't repeat yourself. Make it short. If they do anything remotely interesting, make a big deal about it! The user's intent is to {user_intent} the content. Make it short and sweet, one small paragraph. However, write in the style of the example script. Use the example: {EXAMPLE}. Make sure to include the words 'pookie', '{user_name}', and 'my glorious king'. Keep the content short, one paragraph only. The aim is to embarrass them as much as possible and make them laugh. Here is the user description: {user_description}"
                }
            ],
            model="llama3-70b-8192",
            max_tokens=512,
            temperature=0.0,
            stop=["\n"],
        )


        full_response = response.choices[0].message.content

        # return JSONResponse(content={"response": full_response})
        print(full_response)
        return JSONResponse(content={"response": full_response})
    except Exception as e:
        print(f"Error in /generate endpoint: {str(e)}")
        return JSONResponse(content={"error": "An error occurred"}, status_code=500)

@app.post("/text-to-speech")
async def text_to_speech(request: Request):
    data = await request.json()
    text = data["text"]

    response = el_client.text_to_speech.convert(
        voice_id="NYLllF7eMB4BVAl2miKe",
        optimize_streaming_latency="0",
        output_format="mp3_22050_32",
        text=text,
        model_id="eleven_multilingual_v2",
        voice_settings=VoiceSettings(
            stability=0.5,
            similarity_boost=1.0,
            style=0.4,
            use_speaker_boost=True,
        ),
    )

    audio_stream = BytesIO()
    for chunk in response:
        if chunk:
            audio_stream.write(chunk)

    audio_stream.seek(0)
    unique_id = str(uuid.uuid4())
    s3_key = f"audio_{unique_id}.mp3"
    
    try:
        s3.upload_fileobj(audio_stream, aws_bucket_name, s3_key)
        # presigned_url = s3.generate_presigned_url(
        #     'get_object',
        #     Params={'Bucket': aws_bucket_name, 'Key': s3_key},
        #     ExpiresIn=259200  # URL expiration time in seconds (3 days)
        # )
        presigned_url = s3.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': aws_bucket_name,
            'Key': s3_key,
            'ResponseContentDisposition': 'inline',
            'ResponseContentType': 'audio/mpeg'
        },
        ExpiresIn=259200  # URL expiration time in seconds (3 days)
        )
        return JSONResponse(content={"audio_url": presigned_url})
    except NoCredentialsError as e:
        return JSONResponse(content={"error": "AWS credentials error"}, status_code=500)
    
    
# separate function to stream the audio (asynchronous background task)
async def stream_audio(audio_stream: BytesIO):
    return StreamingResponse(audio_stream, media_type="audio/mp3")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)