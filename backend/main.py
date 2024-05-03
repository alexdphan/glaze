# import os
# from io import BytesIO
# from typing import IO
# import uuid
# from fastapi import FastAPI, Request
# from fastapi.responses import JSONResponse
# from dotenv import load_dotenv
# from elevenlabs import VoiceSettings
# from elevenlabs.client import ElevenLabs
# import ollama
# from openai import OpenAI
# from groq import Groq

# # Ask who to send to (describe person)
# # Ask what to send to them (describe what you want glazed, roast, or cringe)
# # Ask what do they want (glaze, roast, or make cringe)

# load_dotenv()

# ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

# if not ELEVENLABS_API_KEY:
#     raise ValueError("ELEVENLABS_API_KEY environment variable not set")

# el_client = ElevenLabs(api_key=ELEVENLABS_API_KEY, timeout=10000)

# client = Groq(
#     base_url="https://api.groq.com",
#     api_key=os.environ.get("GROQ_API_KEY"),
# )

# USER_NAME = "Amir Dajani"

# # User description (constant)
# USER_DESCRIPTION = "Loves hanging around George Mason University, is a terribly mid basketball player, is Biomedical Engineering Student at George Mason University. Has a body of a praying mantis"

# EXAMPLE = "Boy oh boy, where do I even begin? LeBron, honey, my pookie bear, I have loved you ever since I first laid eyes on you. The way you drive into the paint and strike fear into your enemies' eyes, your silky smooth touch around the rim, and that gorgeous jumpshot - I would do anything for you. I wish it were possible to freeze time so I would never have to watch you retire. You had a rough childhood, but you never gave up hope. You are even amazing off the court; you're a great husband and father. Sometimes I even call you dad. I forever dread and weep, thinking of the day you will one day retire. I would sacrifice my own life if it were the only thing that could put a smile on your beautiful face. You have given me so much joy and heartbreak over the years. I remember when you first left Cleveland, and it's like my heart got broken into a million pieces. But a tear still fell from my right eye when I watched you win your first ring in Miami because, deep down, my glorious king deserved it. I just wanted you to return home. Then, alas, you did. My sweet baby boy came home, and I rejoiced. 2015 was a hard year for us, baby, but in 2016, you made history happen. You came back from 3-1, and I couldn't believe it. I was crying, bawling even, and I heard my glorious king exclaim these words: 'CLEVELAND, THIS IS FOR YOU!' Not only have you changed the game of basketball and the world forever, but you've eternally changed my world. And now, you're getting older but still the GOAT, my GOAT. I love you, pookie bear, my glorious king, LeBron James."

# # User intent (function)
# def get_user_intent():
#     # Placeholder function to get user intent
#     user_intent = "glaze"
#     # Replace this with your actual logic to retrieve the intent
#     return user_intent

# # Ollama chat function
# def generate_response():
#     # user_content = get_user_content()
#     user_intent = get_user_intent()
    
#     response = client.chat.completions.create(
#     messages=[
#         {
#             'role': 'user',
#             'content': f"You are the biggest suck up in the world as a student that is congratulating a senior. You are a huge geek with a huge amount of time on the internet. Describe the personality, person, lifestyle, etc of {USER_NAME} as if your life revolves around this person. Make it snarky and funny. Don't repeat yourself. Make it short. If they do anything remotely interesting, make a big deal about it! The user's intent is to {user_intent} the content. Make it short and sweet, one small paragraph. However, write in the style of the example script. Use the example: {EXAMPLE}. Make sure to include the words 'pookie', '{USER_NAME}', and 'my glorious king'. Keep the content short, one paragraph only. The aim is to embarrass them as much as possible and make them laugh."
#             }
#     ],
#     model="llama3-70b-8192",
#         max_tokens=512,  
#         temperature=0.0,
#         stop=["\n"],
#     )
    
#     full_response = response.choices[0].message.content
    

#     return full_response

# def text_to_speech_stream(text: str) -> IO[bytes]:
#     """
#     Converts text to speech and returns the audio data as a byte stream.

#     This function invokes a text-to-speech conversion API with specified parameters, including
#     voice ID and various voice settings, to generate speech from the provided text. Instead of
#     saving the output to a file, it streams the audio data into a BytesIO object.

#     Args:
#         text (str): The text content to be converted into speech.

#     Returns:
#         IO[bytes]: A BytesIO stream containing the audio data.
#     """
#     # Perform the text-to-speech conversion
#     response = el_client.text_to_speech.convert(
#         voice_id="NYLllF7eMB4BVAl2miKe",
#         optimize_streaming_latency="0",
#         output_format="mp3_22050_32",
#         text=text,
#         model_id="eleven_multilingual_v2",
#         voice_settings=VoiceSettings(
#             stability=0.3,
#             similarity_boost=1.0,
#             style=0.7,
#             use_speaker_boost=True,
#         ),
#     )

#     print("Streaming audio data...")

#     # Create a BytesIO object to hold audio data
#     audio_stream = BytesIO()

#     # Write each chunk of audio data to the stream
#     for chunk in response:
#         if chunk:
#             audio_stream.write(chunk)

#     # Reset stream position to the beginning
#     audio_stream.seek(0)
#     print(audio_stream)
    
#     # Save the audio stream to a file
#     unique_id = str(uuid.uuid4())
#     directory = "audio"
#     os.makedirs(directory, exist_ok=True)
#     with open(f"{directory}/audio_{unique_id}.mp3", "wb") as f:
#         f.write(audio_stream.getvalue())

#     # Return the stream for further use
#     return audio_stream

# if __name__ == "__main__":
#     generated_response = generate_response()
#     print(generated_response)
#     text_to_speech_stream(generated_response)

import os
from io import BytesIO
from typing import IO
import uuid
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, StreamingResponse
from dotenv import load_dotenv
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

if not ELEVENLABS_API_KEY:
    raise ValueError("ELEVENLABS_API_KEY environment variable not set")

el_client = ElevenLabs(api_key=ELEVENLABS_API_KEY, timeout=10000)

client = Groq(
    base_url="https://api.groq.com",
    api_key=os.environ.get("GROQ_API_KEY"),
)

app = FastAPI()

# origins is the list of origins that the API will allow (the frontend)
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            # stability=0.3,
            stability=0.4,
            similarity_boost=1.0,
            style=0.7,
            use_speaker_boost=True,
        ),
    )

    audio_stream = BytesIO()

    for chunk in response:
        if chunk:
            audio_stream.write(chunk)

    audio_stream.seek(0)

    unique_id = str(uuid.uuid4())
    directory = "audio"
    os.makedirs(directory, exist_ok=True)
    with open(f"{directory}/audio_{unique_id}.mp3", "wb") as f:
        f.write(audio_stream.getvalue())

    return StreamingResponse(audio_stream, media_type="audio/mp3")


