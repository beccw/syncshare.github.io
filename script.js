function uploadFile() {
    var fileInput = document.getElementById("fileInput"); // Make sure this ID matches the one in your HTML
    
    // Check if a file is selected
    if (fileInput.files.length > 0) {
        var uploadText = document.getElementById("upload").innerHTML;
        document.getElementById("upload").innerHTML = "Uploading...";
        
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append("file", file);
        
        // Replace with your actual Vercel backend endpoint
        fetch('https://syncshare-github-io-git-main-deergha2s-projects.vercel.app', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('File uploaded:', data.filename);
            document.getElementById("upload").innerHTML = "Upload Successful";
            saveMessage(data.filename); // Assuming saveMessage handles the file path or filename
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
