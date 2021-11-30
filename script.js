var btn_commit = document.getElementById('commit_btn');
var file_selector = document.getElementById('file_selector');

var tab_name = 'Entity';


function click_new() {
    alert('叫你按就按阿?');
}

function click_commit() {
    alert('按你媽逼');
}

function file_selected() {
    let val = file_selector.value;
    display_story(stories_json[val].file_name, stories_json[val].file_content);
}

function change_tab(btn) {
    let label_menu_entity = document.getElementById('label_menu_entity');
    let label_menu_relation = document.getElementById('label_menu_relation');
    let label_menu_event = document.getElementById('label_menu_event');

    let menus = [label_menu_entity, label_menu_relation, label_menu_event];
    console.log(btn.dataset.value);
    console.log(menus[2].getAttribute("data-value"));
    console.log(menus[2].getAttribute("data-value") == btn.dataset.value);


    for (let i = 0; i < menus.length; i++) {
        if (menus[i].getAttribute("data-value") == btn.dataset.value) {
            menus[i].style.display = 'block';
        } else {
            menus[i].style.display = 'none';
        }
    }

    tab_name = btn.innerHTML;
    // console.log(tab_name);
}

btn_commit.addEventListener('click', click_commit);
file_selector.addEventListener('change', file_selected);

var stories_json;

function get_story_data() {
    let url = 'http://140.115.54.59:8000/StoryList';
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            stories_json = myJson;
            get_file_list();
        });
}

function get_file_list() {
    for (let i = 0; i < stories_json.length; i++) {
        let option = document.createElement('option');
        option.text = stories_json[i].file_name;
        option.value = i;
        file_selector.appendChild(option);
    }
}

function display_story(f_title, f_cont) {
    let title = document.getElementById('card_title');
    let content = document.getElementById('card_content')

    title.textContent = f_title;
    content.textContent = f_cont;
    // var tok_list = tokenization(f_cont);
    // doc2btn(tok_list);
}

function tokenization(string) {
    let exp = new RegExp('([\u4e00-\u9fa5])');
    let ret_list = [];
    let splited = string.split(exp);
    for (let tok = 0; tok < splited.length; tok++) {
        if (splited[tok].trim().length > 0) {
            ret_list.push(splited[tok].trim());
        }
    }

    return ret_list;
}

function doc2btn(tok_list) {
    for (let i = 0; i < tok_list.length; i++) {
        let btn = document.createElement("button");
        btn.innerHTML = tok_list[i];
        let content = document.getElementById('card_content');
        content.appendChild(btn);
    }
}

get_story_data();