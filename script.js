var btn_new = document.getElementById('new_btn');
var btn_commit = document.getElementById('commit_btn');

function click_new() {
    alert('叫你按就按阿?');
}

function click_commit() {
    alert('按你媽逼');
}

btn_new.addEventListener('click', click_new);
btn_commit.addEventListener('click', click_commit);

var file_selector = document.getElementById('file_selector');

var stories_json;

function get_story_data() {
    var url = 'http://140.115.54.59:8000/StoryList';
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            // console.log(myJson);
            stories_json = myJson;
            // console.log(stories_json);
        });
}

function get_file_list() {
    // for (story in stories_json) {
    //     file_selector.append(story)
    // }
    file_selector.append("testtets");
}

get_story_data();


get_story_data();