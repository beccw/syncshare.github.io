document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      document.getElementById('uploadStatus').textContent = result.message;
      const fileUrl = result.url;
      console.log('File URL:', fileUrl); // Optional: Log the file URL
  
      // Display the uploaded file
      const uploadedFileLink = document.createElement('a');
      uploadedFileLink.href = fileUrl;
      uploadedFileLink.textContent = 'View Uploaded File';
      document.getElementById('uploadStatus').appendChild(uploadedFileLink);
    } catch (error) {
      document.getElementById('uploadStatus').textContent = 'Upload failed!';
    }
  });
  