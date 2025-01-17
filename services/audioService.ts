export async function processAudioMessage(audioBlob: Blob) {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.wav')

  const response = await fetch('/api/chat', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to process audio message')
  }

  return response.json()
}

