function uploadFile() {
    var fileInput = document.getElementById("file");
    
    // Check if a file is selected
    if (fileInput.files.length > 0) {
        var uploadText = document.getElementById("upload").innerHTML;
        document.getElementById("upload").innerHTML = "Uploading...";
        
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append("file", file);
        
        // Adjust 'http://localhost:your_port/upload' to your actual backend endpoint
        fetch('http://localhost:your_port/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('File uploaded:', data.filePath);
            document.getElementById("upload").innerHTML = "Upload Successful";
            saveMessage(data.filePath); // Assuming saveMessage handles the file path
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            document.getElementById("upload").innerHTML = "Upload Failed";
        });
    } else {
        document.getElementById("upload").innerHTML = "Please select a file";
        setTimeout(function() {
            document.getElementById("upload").innerHTML = uploadText;
        }, 2000);
    }
}
