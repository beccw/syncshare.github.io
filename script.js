document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
  
    try {
      const response = await fetch('https://your-vercel-domain.vercel.app/api/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      document.getElementById('uploadStatus').textContent = result.message;
    } catch (error) {
      document.getElementById('uploadStatus').textContent = 'Upload failed!';
    }
  });
  