# Seting up an immediate feedback loop

Clone the repo to a `local_folder`

```shell
    git clone https://github.com/DrBoolean/mostly-adequate-guide.git    
```

change directory to the code folder in repository root 
```shell
    cd /path/to/local_folder/mostly-adequate-guide/code/
```

install mocha and any dependencies you see in exercie file
```shell
    npm install -g mocha
```

run the test runner with the spec file for that exercise

```shell
    # for example
    mocha /path/to/local_folder/mostly-adequate-guide/code/part1_exercises/exercises/curry/curry_exercises_spec.js -w
```

this brings up the mocha test runner which shows the error immediately when you save the file with changed code. Achieve the requested refactor while keeping all the arrows green.
