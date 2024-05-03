import boto3

# Create an S3 client
s3_client = boto3.client('s3', aws_access_key_id='YOUR_ACCESS_KEY', aws_secret_access_key='YOUR_SECRET_KEY')

# Upload the audio file to S3
bucket_name = 'your-bucket-name'
object_key = f'audio/{unique_id}.mp3'
s3_client.upload_fileobj(audio_stream, bucket_name, object_key)

# Generate the URL for the uploaded file
url = s3_client.generate_presigned_url('get_object', Params={'Bucket': bucket_name, 'Key': object_key}, ExpiresIn=3600)

# Return the URL as part of your API response or store it in a database