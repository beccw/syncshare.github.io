function uploadFile() {
    var fileInput = document.getElementById("fileInput");
    
    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append("file", file);
        
        fetch('https://syncshare-github-io-git-main-deergha2s-projects.vercel.app/api/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('File uploaded:', data.filePath);
            document.getElementById("message").innerText = "Upload Successful: " + data.filePath;
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            document.getElementById("message").innerText = "Upload Failed: " + error.message;
        });
    } else {
        document.getElementById("message").innerText = "Please select a file";
    }
}
