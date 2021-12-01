var btn_commit = document.getElementById('commit_btn');
var file_selector = document.getElementById('file_selector');
var select1 = document.getElementById('select_1');
var select2 = document.getElementById('select_2');
var select3 = document.getElementById('select_3');
select2.style.display = 'none';
select3.style.display = 'none';

var current_tab = 'Entity';
var current_menu1 = '';
var current_menu2 = '';
var current_menu3 = '';

function click_commit() {
    alert('Commit to Server!');
}

function file_selected() {
    let val = file_selector.value;
    display_story(stories_json[val].file_name, stories_json[val].file_content);
}

function remove_all_options() {
    while (select1.firstChild) {
        select1.removeChild(select1.firstChild);
    }
}

function tagging_selections_reset() {
    while (select1.firstChild) {
        select1.removeChild(select1.firstChild);
    }
    select2.style.display = 'none';
    select3.style.display = 'none';
}

function generate_options_1(tab) {
    let select1_opts = ERE_menu1[tab];

    for (let i = 0; i < select1_opts.length; i++) {
        let option = document.createElement('option');
        option.text = select1_opts[i];
        option.value = select1_opts[i];
        select1.appendChild(option);
    }
}

function select1_changed() {
    let opt_value = select1.value;
    let select2_opts = menu1_menu2[opt_value];
    if (typeof select2_opts == "undefined") {
        select2.style.display = 'none';
        select3.style.display = 'none';
    } else {
        select2.style.display = 'block';
        while (select2.firstChild) {
            select2.removeChild(select2.firstChild);
        }
        for (let i = 0; i < select2_opts.length; i++) {
            let option = document.createElement('option');
            option.text = select2_opts[i];
            option.value = select2_opts[i];
            select2.appendChild(option);
        }
        select2_changed();
    }
}

function select2_changed() {
    let opt_value = select2.value;
    let select3_opts = menu2_menu3[opt_value];
    if (typeof select3_opts == "undefined") {
        select3.style.display = 'none';
    } else {
        select3.style.display = 'block';
        while (select3.firstChild) {
            select3.removeChild(select3.firstChild);
        }
        for (let i = 0; i < select3_opts.length; i++) {
            let option = document.createElement('option');
            option.text = select3_opts[i];
            option.value = select3_opts[i];
            select3.appendChild(option);
        }
    }
}

function change_tab(btn) {
    tagging_selections_reset();
    generate_options_1(btn.dataset.value);

    current_tab = btn.innerHTML;
}

btn_commit.addEventListener('click', click_commit);
file_selector.addEventListener('change', file_selected);
select1.addEventListener('change', select1_changed);
select2.addEventListener('change', select2_changed);

var stories_json;

function get_story_data() {
    let url = 'http://140.115.54.59:8000/StoryList';
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            stories_json = myJson;
            generate_file_list();
        });
}

function generate_file_list() {
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

var ERE_menu1 = {
    "Entity": ["Per", "Org", "Loc", "Fac", "Veh", "Wea"],
    "Relation": [""],
    "Event": ["Life", "Movement", "Transaction", "Business", "Conflict", "Contact", "Personnel", "Justice"]
}

var menu1_menu2 = {
    "Life": ["Be-Born", "Marry", "Divorce", "Injure", "Die"],
    "Movement": ["Transport"],
    "Transaction": ["Transfer-Ownership", "Transfer-Money"],
    "Business": ["Start-Org", "Merge-Org", "Declare-Bankruptcy", "End-Org"],
    "Conflict": ["Attack", "Demonstrate"],
    "Personnel": ["Start-Position", "End-Position", "Nominate", "Elect"],
    "Justice": ["Arrest-Jail", "Release-Parole", "Trial-Hearing", "Charge-Indict", "Sue", "Convict", "Sentence", "Fine", "Execute", "Extradite", "Acquit", "Pardon", "Appeal"],
    "Contact": ["Meet", "Phone-Write"]
}

var menu2_menu3 = {
    "Be-Born": ["Person", "Time", "Place"],
    "Marry": ["Person", "Time", "Place"],
    "Divorce": ["Person", "Time", "Place"],
    "Injure": ["Agent", "Victim", "Instrument", "Time", "Place"],
    "Die": ["Agent", "Victim", "Instrument", "Time", "Place"],
    "Transport": ["Agent", "Transporter", "Artifact", "Vehicle", "Origin", "Destinat", "Price", "Time"],
    "Transfer-Ownership": ["Buyer", "Seller", "Beneficiary", "Artifact", "Price", "Time", "Place"],
    "Transfer-Money": ["Giver", "Recipient", "Beneficiary", "Money", "Time", "Place"],
    "Start-Org": ["Agent", "Org", "Time", "Place"],
    "Merge-Org": ["Org", "Time", "Place"],
    "Declare-Bankruptcy": ["Org", "Time", "Place"],
    "End-Org": ["Org", "Time", "Place"],
    "Attack": ["Attacker", "Target", "Instrument", "Time", "Place"],
    "Demonstrate": ["Entity", "Time", "Place"],
    "Start-Position": ["Person", "Entity", "Position", "Time", "Place"],
    "End-Position": ["Person", "Entity", "Position", "Time", "Place"],
    "Nominate": ["Person", "Agent", "Position", "Time", "Place"],
    "Elect": ["Person", "Entity", "Position", "Time", "Place"],
    "Arrest-Jail": ["Person", "Agent", "Crime", "Time", "Duration", "Place"],
    "Release-Parole": ["Person", "Entity", "Crime", "Time", "Place"],
    "Trial-Hearing": ["Defendant", "Prosecutor", "Adjudicator", "Crime", "Time", "Place"],
    "Charge-Indict": ["Defendant", "Prosecutor", "Adjudicator", "Crime", "Time", "Place"],
    "Sue": ["Plaintiff", "Defendant", "Adjudicator", "Crime", "Time", "Place"],
    "Convict": ["Defendant", "Adjudicator", "Crime", "Time", "Place"],
    "Sentence": ["Sentence", "Defendant", "Adjudicator", "Crime", "Time", "Place"],
    "Fine": ["Entity", "Adjudicator", "Money", "Crime", "Time", "Place"],
    "Execute": ["Person", "Agent", "Crime", "Time", "Place"],
    "Extradite": ["Agent", "Person", "Destination", "Origin", "Time", "Crime"],
    "Acquit": ["Defendant", "Adjudicator", "Crime", "Time", "Place"],
    "Pardon": ["Defendant", "Adjudicator", "Crime", "Time", "Place"],
    "Appeal": ["Defendant", "Prosecutor", "Adjudicator", "Crime", "Time", "Place"],
    "Meet": ["Entity", "Time", "Duration", "Place"],
    "Phone-Write": ["Entity", "Time", "Duration", "Place"]
}