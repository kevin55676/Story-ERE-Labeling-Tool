var btn_commit = document.getElementById('commit_btn');
var file_selector = document.getElementById('file_selector');
var select1 = document.getElementById('select_1');
var select2 = document.getElementById('select_2');
var select3 = document.getElementById('select_3');
var args_display = document.getElementById('args_display');
var tag_display = document.getElementById('nav-home');

select2.style.display = 'none';
select3.style.display = 'none';

var current_tab = 'Entity';

var args = [];
var taggings = [];

function click_commit() {
    alert('Commit to Server!');
}

function click_Done() {
    if (args.length != 0) {
        taggings.push([current_tab, args]);
    }
    args = [];

    refresh_tag_display();
    reset_args_display();
}

function del_tag(btn) {
    let num = btn.dataset.value;
    taggings.splice(num, 1);

    refresh_tag_display();
}

function click_CreateArg() {
    selectedTexts = window.getSelection();
    // console.log(document.getSelection());
    let text = window.getSelection().toString();
    let anchor_node = window.getSelection().anchorNode.parentNode;
    let focus_node = window.getSelection().focusNode.parentNode;
    let start = anchor_node.dataset.value;
    let end = (parseInt(focus_node.dataset.value, 10) + 1).toString();

    if (current_tab == 'Event') {
        let arg_type = select3.value;
        let arg = create_event_obj(arg_type, text, start, end);
        args.push(arg);
    } else if (current_tab == 'Entity') {
        let arg_type = select1.value;
        let arg = create_entity_obj(arg_type, text, start, end);
        args.push(arg);
    } else if (current_tab == 'Relation') {
        create_relation_obj();
    }

    refresh_args_display();
}

function over_tag() {
    //TODO: 高亮選取的tag
    alert('hi');
}

function create_entity_obj(arg_type, text, start, end) {
    let arg = {
        'Arg_type': arg_type,
        'Text': text,
        'Start': start,
        'End': end
    }

    return arg;
}

function create_relation_obj() {
}

function create_event_obj(arg_type, text, start, end) {
    let arg = {
        'Arg_type': arg_type,
        'Text': text,
        'Start': start,
        'End': end
    }

    return arg;
}

function reset_args_display() {
    while (args_display.firstChild) {
        args_display.removeChild(args_display.firstChild);
    }
}

function reset_tag_display() {
    while (tag_display.firstChild) {
        tag_display.removeChild(tag_display.firstChild);
    }
}

function refresh_args_display() {
    // reset the args list first
    reset_args_display();

    // generate args according to args list
    for (let i = 0; i < args.length; i++) {
        let wrapper = document.createElement('div');
        let arg_type = document.createElement('span');
        arg_type.innerHTML = args[i]['Arg_type'];
        let text = document.createElement('span');
        text.innerHTML = args[i]['Text']
        wrapper.appendChild(arg_type);
        wrapper.appendChild(text);
        args_display.appendChild(wrapper);
    }
}

function refresh_tag_display() {
    reset_tag_display();

    for (let i = 0; i < taggings.length; i++) {
        let wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'row');
        let del_btn = get_delBtn(i);
        let tag_wrapper = get_tagWrapper(taggings[i][0]);
        for (let j = 0; j < taggings[i][1].length; j++) {
            let arg_wrapper = document.createElement('div');
            arg_wrapper.setAttribute('onclick', 'over_tag()');
            arg_wrapper.style.width = 'fit-content';
            let arg = document.createElement('span');
            arg.innerHTML = taggings[i][1][j]['Arg_type'];
            let text = document.createElement('span');
            text.innerHTML = taggings[i][1][j]['Text'];

            arg_wrapper.appendChild(arg);
            arg_wrapper.appendChild(text);
            tag_wrapper.appendChild(arg_wrapper);
        }
        wrapper.appendChild(del_btn);
        wrapper.appendChild(tag_wrapper);
        tag_display.appendChild(wrapper);
    }
}


function get_tagWrapper(tab) {
    let tag_wrapper = document.createElement('div');
    tag_wrapper.style.border = '2px solid black';
    tag_wrapper.style.width = 'fit-content';
    tag_wrapper.style.backgroundColor = 'rgba(' + rgb_dict[tab]["R"] + ',' + rgb_dict[tab]["G"] + ',' +
        rgb_dict[tab]["B"] + ',' + unselected_opacity + ')';

    return tag_wrapper;
}

function get_delBtn(i) {
    let del_btn = document.createElement('button');
    del_btn.setAttribute('type', 'button');
    del_btn.setAttribute('class', 'btn-close');
    del_btn.setAttribute('aria-label', 'Close');
    del_btn.setAttribute('onclick', 'del_tag(this)');
    del_btn.setAttribute('data-value', i);

    return del_btn;
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
    args = [];
    reset_args_display();

    generate_options_1(btn.dataset.value);

    current_tab = btn.innerHTML;
}

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
    let content = document.getElementById('card_content');

    title.textContent = f_title;
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    var tok_list = tokenization(f_cont);
    for (let i = 0; i < tok_list.length; i++) {
        let spam = document.createElement('spam');
        spam.innerHTML = tok_list[i];
        spam.dataset.value = i;
        content.appendChild(spam);
    }
}

function tokenization(string) {
    let exp = new RegExp('([\u4e00-\u9fa5:：!！「」，。?？])');
    let ret_list = [];
    let splited = string.split(exp);
    for (let tok = 0; tok < splited.length; tok++) {
        if (splited[tok].trim().length > 0) {
            ret_list.push(splited[tok].trim());
        }
    }

    // console.log(ret_list);
    return ret_list;
}

get_story_data();

var ERE_menu1 = {
    "Entity": ["Per", "Org", "Loc", "Fac", "Veh", "Wea"],
    "Relation": [""],
    "Event": ["Life", "Movement", "Transaction", "Business", "Conflict", "Contact", "Personnel", "Justice"]
};

var menu1_menu2 = {
    "Life": ["Be-Born", "Marry", "Divorce", "Injure", "Die"],
    "Movement": ["Transport"],
    "Transaction": ["Transfer-Ownership", "Transfer-Money"],
    "Business": ["Start-Org", "Merge-Org", "Declare-Bankruptcy", "End-Org"],
    "Conflict": ["Attack", "Demonstrate"],
    "Personnel": ["Start-Position", "End-Position", "Nominate", "Elect"],
    "Justice": ["Arrest-Jail", "Release-Parole", "Trial-Hearing", "Charge-Indict", "Sue", "Convict", "Sentence", "Fine", "Execute", "Extradite", "Acquit", "Pardon", "Appeal"],
    "Contact": ["Meet", "Phone-Write"]
};

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
};

var rgb_dict = {
    "Entity": {
        "R": 153,
        "G": 102,
        "B": 255
    },
    "Relation": {
        "R": 255,
        "G": 80,
        "B": 80
    },
    "Event": {
        "R": 0,
        "G": 204,
        "B": 102
    }
}

var selected_opacity = 0.8;
var unselected_opacity = 0.3;