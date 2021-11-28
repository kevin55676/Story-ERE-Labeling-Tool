var btn_new = document.getElementById('new_btn');
var btn_commit = document.getElementById('commit_btn');
var file_selector = document.getElementById('file_selector');


function click_new() {
    alert('叫你按就按阿?');
}

function click_commit() {
    alert('按你媽逼');
}

function file_selected() {
    var val = file_selector.value;
    display_story(stories_json[val].file_name, stories_json[val].file_content);
}

btn_new.addEventListener('click', click_new);
btn_commit.addEventListener('click', click_commit);
file_selector.addEventListener('change', file_selected);

var stories_json;

function get_story_data() {
    var url = 'http://140.115.54.59:8000/StoryList';
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            stories_json = myJson;
            // console.log(stories_json);
            get_file_list();
        });
}

function get_file_list() {
    for (var i = 0; i < stories_json.length; i++) {
        var option = document.createElement('option');
        option.text = stories_json[i].file_name;
        option.value = i;
        file_selector.appendChild(option);
    }
}

function display_story(f_title, f_cont) {
    var title = document.getElementById('card_title');
    var content = document.getElementById('card_content')

    title.textContent = f_title;
    content.textContent = f_cont;
}

function tokenization(string) {

}

get_story_data();

function regTest() {
    var regExp = new RegExp('a-zA-Z0-9');
    var string = 'this is test'
    console.log(string.split(regExp));
}

regTest();