document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const fileInput = form.querySelector('input[type="file"]');
        const formData = new FormData(form);

        if (!fileInput.files.length) {
            alert('Please select a file to upload.');
            return;
        }

        fetch('/anonymous_upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert('File uploaded successfully!');
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});
