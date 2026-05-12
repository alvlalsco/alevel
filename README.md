This is official code for new A-Level Website from July'25 ALSCO Evan Yeoh and Austin. 
Website has total of 
6 Pages (index, About, Committee, Events, Resource, ALSTAR)
1 master script (script.js) and 7 Page Scripts (about, alstar, committee, content, events, index, resource)
The Content of the website are Stored in 'content.js' and injected into the html pages via their respective scripts. To update the website is to update the content in 'content.js' unless more change is needed to be done.

The website used html, javascript and Tailwindcss V4. It's hosted on netlify, thus the netlify.toml.
1 tool for this website is the image-converter. It converts large image size (png, jpg, etc) into .avif files which is optimised for website loading and data transfer. 
The converter images are stored in 'images' folder. The content.js stores the location of these images in strings to the page scripts could easily obtain image location and get them. 
