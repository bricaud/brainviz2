# Interactive visualization of the connections between brain regions

The Jupyter notebook convert the brain info from the csv file to a graph encoded in a json file.
The visualization is done with D3.js.
The data is public and coming from  [http://pitgroup.org/connectome/]
You can see it as a demo on the [http://brain.eviacybernetics.com/budapest/index.html](Evia Cybernetics page).
You can run it yourself. You need to run a web server (easy with Python):
```
python -m http.server 8000 --bind 127.0.0.1
```
Then just access the `index.html` url: `localhost:8000/index.html`.


