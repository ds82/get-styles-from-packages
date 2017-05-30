# get-styles-from-packages

This tiny module iterates over all your dependencies and tries to find packages that contain
a style property in their package.json. It returns an array with all style files of 3rd party
packages. Use this list to inject these files into your css/style sheet bundle pipeline
