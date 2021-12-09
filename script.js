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
var temp_tag = [];

// event listerer when click commit button
function click_commit() {
    alert('Commit to Server!');
    // TODO: 完成上傳的實作
}

// event listener when click done button
function click_Done() {
    if (args.length == 0) {
        return;
    }
    let dict;
    if (current_tab == "Entity") {
        dict = {
            'tab': current_tab,
            'entity_type': select1.value,
            'args': args
        };
    } else if (current_tab == "Relation") {
        dict = {
            'tab': current_tab,
            'args': args
        };
    } else if (current_tab == "Event") {
        dict = {
            'tab': current_tab,
            'event_type': select2.value,
            'args': args
        };
    }
    taggings.push(dict);
    args = [];

    refresh_tag_display();
    reset_args_display();
}

// event listener when click CreateArg button
function click_CreateArg() {
    selectedTexts = window.getSelection();
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

// event listener when click tag
function click_tag(wrapper) {
    let num = wrapper.dataset.value;
    args = taggings[num]['args'];
    if (current_tab == "Event") {
        let sel2_val = taggings[num]['event_type'];
        for (let key in menu1_menu2) {
            if (menu1_menu2[key].includes(sel2_val)) {
                select1.value = key;
                select1_changed();
                select2.value = sel2_val;
                break;
            }
        }
    }
    taggings.splice(num, 1);

    refresh_tag_display();
    refresh_args_display();
}

// event listener when click tag delete button
function del_tag(btn) {
    let num = btn.dataset.value;
    taggings.splice(num, 1);

    refresh_tag_display();
}

// event listener when click arg delete button
function del_arg(btn) {
    let num = btn.dataset.value;
    args.splice(num, 1);

    refresh_args_display();
}

// event listener when mouse moves into the tag area
function over_tag(wrapper) {
    let style = getComputedStyle(wrapper)
    wrapper.style.backgroundColor = style.backgroundColor.replace(unselected_opacity, selected_opacity);

    let content = document.getElementById('card_content');
    let children = content.children;
    let num = wrapper.dataset.value;

    if (taggings[num]['tab'] != current_tab) {
        return;
    }

    for (let i = 0; i < taggings[num]['args'].length; i++) {
        for (let j = 0; j < taggings[num]['args'].length; j++) {
            for (let k = parseInt(taggings[num]['args'][j]['Start']); k < parseInt(taggings[num]['args'][j]['End']); k++) {
                let child_style = getComputedStyle(children[k]);
                children[k].style.backgroundColor = child_style.backgroundColor.replace(unselected_opacity, selected_opacity);
            }
        }
    }
}

// event listener when mouse moves out the tag area
function leave_tag(wrapper) {
    let style = getComputedStyle(wrapper)
    wrapper.style.backgroundColor = style.backgroundColor.replace(selected_opacity, unselected_opacity);

    let content = document.getElementById('card_content');
    let children = content.children;
    let num = wrapper.dataset.value;

    for (let i = 0; i < taggings[num]['args'].length; i++) {
        for (let j = 0; j < taggings[num]['args'].length; j++) {
            for (let k = parseInt(taggings[num]['args'][j]['Start']); k < parseInt(taggings[num]['args'][j]['End']); k++) {
                let child_style = getComputedStyle(children[k]);
                children[k].style.backgroundColor = child_style.backgroundColor.replace(selected_opacity, unselected_opacity);
            }
        }
    }
}

// generate a entity tag
function create_entity_obj(arg_type, text, start, end) {
    let arg = {
        'Arg_type': arg_type,
        'Text': text,
        'Start': start,
        'End': end
    }

    return arg;
}

// generate a relation tag
function create_relation_obj() {
    // TODO: 新增 relation 的內容
}

// generate a event tag
function create_event_obj(arg_type, text, start, end) {
    let arg = {
        'Arg_type': arg_type,
        'Text': text,
        'Start': start,
        'End': end
    }

    return arg;
}

// reset the args display area
function reset_args_display() {
    while (args_display.firstChild) {
        args_display.removeChild(args_display.firstChild);
    }
}

// reset the tags display area
function reset_tag_display() {
    while (tag_display.firstChild) {
        tag_display.removeChild(tag_display.firstChild);
    }
}

// reset the selection bars
function reset_tagging_selections() {
    while (select1.firstChild) {
        select1.removeChild(select1.firstChild);
    }
    select2.style.display = 'none';
    select3.style.display = 'none';
}

// set the story background to white
function reset_story_color() {
    let content = document.getElementById('card_content');
    let children = content.children;

    for (let i = 0; i < children.length; i++) {
        children[i].style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }
}

// refresh the args display area
function refresh_args_display() {
    // reset the args list first
    reset_args_display();

    // generate args according to args list
    for (let i = 0; i < args.length; i++) {
        let wrapper = document.createElement('div');
        let del_btn = get_delBtn(i, 'arg');
        let arg_type = document.createElement('span');
        arg_type.innerHTML = args[i]['Arg_type'];
        let text = document.createElement('span');
        text.innerHTML = args[i]['Text'];
        wrapper.appendChild(del_btn);
        wrapper.appendChild(arg_type);
        wrapper.appendChild(text);
        args_display.appendChild(wrapper);
    }
}

// refresh the tags display area
function refresh_tag_display() {
    reset_tag_display();

    for (let i = 0; i < taggings.length; i++) {
        if (taggings[i]['tab'] != current_tab) {
            continue;
        }

        let wrapper;
        if (current_tab == "Entity") {
            wrapper = entity_displayer(i);
        } else if (current_tab == "Relation") {

        } else if (current_tab == "Event") {
            wrapper = event_displayer(i);
        }

        tag_display.appendChild(wrapper);
    }

    refresh_story();
}

// refresh the story display area
function refresh_story() {
    reset_story_color();

    let content = document.getElementById('card_content');
    let children = content.children;
    for (let i = 0; i < taggings.length; i++) {
        // we only show the tag which belongs to current tab
        if (taggings[i]['tab'] != current_tab) {
            continue;
        }

        for (let j = 0; j < taggings[i]['args'].length; j++) {
            // k 用來指定文章中字的範圍
            for (let k = parseInt(taggings[i]['args'][j]['Start']); k < parseInt(taggings[i]['args'][j]['End']); k++) {
                let filter = taggings[i]['tab'];

                if (filter == "Entity") {
                    let color = taggings[i]['entity_type'];
                    children[k].style.backgroundColor = 'rgba(' + entity_rgb[color]["R"] + ',' + entity_rgb[color]["G"] + ',' +
                        entity_rgb[color]["B"] + ',' + unselected_opacity + ')';
                } else if (filter == "Relation") {

                } else if (filter == "Event") {
                    let color = taggings[i]['event_type'];
                    children[k].style.backgroundColor = 'rgba(' + event_rgb[color]["R"] + ',' + event_rgb[color]["G"] + ',' +
                        event_rgb[color]["B"] + ',' + unselected_opacity + ')';
                }
            }
        }
    }
}

function entity_displayer(i) {
    let wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'row');
    let del_btn = get_delBtn(i, 'tag');
    let color = taggings[i]['entity_type'];
    let r = entity_rgb[color]["R"];
    let g = entity_rgb[color]["G"];
    let b = entity_rgb[color]["B"];
    let tag_wrapper = get_tagWrapper(i, r, g, b);

    for (let j = 0; j < taggings[i]['args'].length; j++) {
        let arg_wrapper = document.createElement('div');
        arg_wrapper.style.width = 'fit-content';
        let arg = document.createElement('span');
        arg.innerHTML = taggings[i]['args'][j]['Arg_type'];
        let text = document.createElement('span');
        text.innerHTML = taggings[i]['args'][j]['Text'];

        arg_wrapper.appendChild(arg);
        arg_wrapper.appendChild(text);
        tag_wrapper.appendChild(arg_wrapper);
    }
    wrapper.appendChild(del_btn);
    wrapper.appendChild(tag_wrapper);

    return wrapper;
}

function relation_displayer(i) {
    // TODO: finish this part
}

function event_displayer(i) {
    let wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'row');
    let del_btn = get_delBtn(i, 'tag');
    let color = taggings[i]['event_type'];
    let r = event_rgb[color]["R"];
    let g = event_rgb[color]["G"];
    let b = event_rgb[color]["B"];
    let tag_wrapper = get_tagWrapper(i, r, g, b);

    let event_wrapper = document.createElement('div');
    event_wrapper.style.width = 'fit-content';
    let EVENT = document.createElement('span');
    EVENT.innerHTML = "Event";
    let event_name = document.createElement('span');
    event_name.innerHTML = taggings[i]['event_type'];
    event_wrapper.appendChild(EVENT);
    event_wrapper.appendChild(event_name);
    tag_wrapper.appendChild(event_wrapper);

    for (let j = 0; j < taggings[i]['args'].length; j++) {
        let arg_wrapper = document.createElement('div');
        arg_wrapper.style.width = 'fit-content';
        let arg = document.createElement('span');
        arg.innerHTML = taggings[i]['args'][j]['Arg_type'];
        let text = document.createElement('span');
        text.innerHTML = taggings[i]['args'][j]['Text'];

        arg_wrapper.appendChild(arg);
        arg_wrapper.appendChild(text);
        tag_wrapper.appendChild(arg_wrapper);
    }
    wrapper.appendChild(del_btn);
    wrapper.appendChild(tag_wrapper);

    return wrapper;
}

function get_tagWrapper(i, r, g, b) {
    let tag_wrapper = document.createElement('div');
    tag_wrapper.setAttribute('onmouseenter', 'over_tag(this)');
    tag_wrapper.setAttribute('onmouseleave', 'leave_tag(this)');
    tag_wrapper.setAttribute('onclick', 'click_tag(this)');
    tag_wrapper.setAttribute('data-value', i);
    tag_wrapper.style.backgroundColor = 'rgba(' + r + ',' +
        g + ',' + b + ',' + unselected_opacity + ')';
    tag_wrapper.style.border = '2px solid black';
    tag_wrapper.style.width = 'fit-content';


    return tag_wrapper;
}

function get_delBtn(i, type) {
    let del_btn = document.createElement('button');
    del_btn.setAttribute('type', 'button');
    del_btn.setAttribute('class', 'btn-close');
    del_btn.setAttribute('aria-label', 'Close');
    del_btn.setAttribute('data-value', i);
    if (type == 'tag') {
        del_btn.setAttribute('onclick', 'del_tag(this)');
    } else if (type == 'arg') {
        del_btn.setAttribute('onclick', 'del_arg(this)');
    }

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

// event listener when user change the tab
function change_tab(btn) {
    reset_tagging_selections();
    args = [];
    reset_args_display();

    generate_options_1(btn.dataset.value);

    current_tab = btn.innerHTML;
    refresh_story();
    refresh_tag_display();
}

var stories_json;

// get the story list and content from server
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

// generate options (file list) to file selector
function generate_file_list() {
    for (let i = 0; i < stories_json.length; i++) {
        let option = document.createElement('option');
        option.text = stories_json[i].file_name;
        option.value = i;
        file_selector.appendChild(option);
    }
}

// display story content at story display area
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

// split the story content
function tokenization(string) {
    let exp = new RegExp('([\u4e00-\u9fa5:：!！「」，。?？])');
    let ret_list = [];
    let splited = string.split(exp);
    for (let tok = 0; tok < splited.length; tok++) {
        if (splited[tok].trim().length > 0) {
            ret_list.push(splited[tok].trim());
        }
    }

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
    "Be-Born": ["Trigger_Word", "Person", "Time", "Place"],
    "Marry": ["Trigger_Word", "Person", "Time", "Place"],
    "Divorce": ["Trigger_Word", "Person", "Time", "Place"],
    "Injure": ["Trigger_Word", "Agent", "Victim", "Instrument", "Time", "Place"],
    "Die": ["Trigger_Word", "Agent", "Victim", "Instrument", "Time", "Place"],
    "Transport": ["Trigger_Word", "Agent", "Transporter", "Artifact", "Vehicle", "Origin", "Destinat", "Price", "Time"],
    "Transfer-Ownership": ["Trigger_Word", "Buyer", "Seller", "Beneficiary", "Artifact", "Price", "Time", "Place"],
    "Transfer-Money": ["Trigger_Word", "Giver", "Recipient", "Beneficiary", "Money", "Time", "Place"],
    "Start-Org": ["Trigger_Word", "Agent", "Org", "Time", "Place"],
    "Merge-Org": ["Trigger_Word", "Org", "Time", "Place"],
    "Declare-Bankruptcy": ["Trigger_Word", "Org", "Time", "Place"],
    "End-Org": ["Trigger_Word", "Org", "Time", "Place"],
    "Attack": ["Trigger_Word", "Attacker", "Target", "Instrument", "Time", "Place"],
    "Demonstrate": ["Trigger_Word", "Entity", "Time", "Place"],
    "Start-Position": ["Trigger_Word", "Person", "Entity", "Position", "Time", "Place"],
    "End-Position": ["Trigger_Word", "Person", "Entity", "Position", "Time", "Place"],
    "Nominate": ["Trigger_Word", "Person", "Agent", "Position", "Time", "Place"],
    "Elect": ["Trigger_Word", "Person", "Entity", "Position", "Time", "Place"],
    "Arrest-Jail": ["Trigger_Word", "Person", "Agent", "Crime", "Time", "Duration", "Place"],
    "Release-Parole": ["Trigger_Word", "Person", "Entity", "Crime", "Time", "Place"],
    "Trial-Hearing": ["Trigger_Word", "Defendant", "Prosecutor", "Adjudicator", "Crime", "Time", "Place"],
    "Charge-Indict": ["Trigger_Word", "Defendant", "Prosecutor", "Adjudicator", "Crime", "Time", "Place"],
    "Sue": ["Trigger_Word", "Plaintiff", "Defendant", "Adjudicator", "Crime", "Time", "Place"],
    "Convict": ["Trigger_Word", "Defendant", "Adjudicator", "Crime", "Time", "Place"],
    "Sentence": ["Trigger_Word", "Sentence", "Defendant", "Adjudicator", "Crime", "Time", "Place"],
    "Fine": ["Trigger_Word", "Entity", "Adjudicator", "Money", "Crime", "Time", "Place"],
    "Execute": ["Trigger_Word", "Person", "Agent", "Crime", "Time", "Place"],
    "Extradite": ["Trigger_Word", "Agent", "Person", "Destination", "Origin", "Time", "Crime"],
    "Acquit": ["Trigger_Word", "Defendant", "Adjudicator", "Crime", "Time", "Place"],
    "Pardon": ["Trigger_Word", "Defendant", "Adjudicator", "Crime", "Time", "Place"],
    "Appeal": ["Trigger_Word", "Defendant", "Prosecutor", "Adjudicator", "Crime", "Time", "Place"],
    "Meet": ["Trigger_Word", "Entity", "Time", "Duration", "Place"],
    "Phone-Write": ["Trigger_Word", "Entity", "Time", "Duration", "Place"]
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

var entity_rgb = {
    "Per": { "R": 0, "G": 102, "B": 153 },
    "Org": { "R": 51, "G": 51, "B": 255 },
    "Loc": { "R": 153, "G": 51, "B": 255 },
    "Fac": { "R": 204, "G": 0, "B": 204 },
    "Veh": { "R": 204, "G": 0, "B": 102 },
    "Wea": { "R": 204, "G": 102, "B": 0 }
}

var relation_rgb = {}

var event_rgb = {
    "Be-Born": { "R": 0, "G": 102, "B": 153 },
    "Marry": { "R": 0, "G": 204, "B": 153 },
    "Divorce": { "R": 0, "G": 153, "B": 51 },
    "Injure": { "R": 102, "G": 153, "B": 0 },
    "Die": { "R": 204, "G": 204, "B": 0 },
    "Transport": { "R": 255, "G": 153, "B": 0 },
    "Transfer-Ownership": { "R": 255, "G": 51, "B": 0 },
    "Transfer-Money": { "R": 204, "G": 0, "B": 102 },
    "Start-Org": { "R": 204, "G": 51, "B": 153 },
    "Merge-Org": { "R": 204, "G": 0, "B": 204 },
    "Declare-Bankruptcy": { "R": 153, "G": 51, "B": 255 },
    "End-Org": { "R": 51, "G": 51, "B": 204 },
    "Attack": { "R": 0, "G": 102, "B": 204 },
    "Demonstrate": { "R": 51, "G": 204, "B": 204 },
    "Start-Position": { "R": 0, "G": 255, "B": 153 },
    "End-Position": { "R": 51, "G": 204, "B": 51 },
    "Nominate": { "R": 153, "G": 255, "B": 51 },
    "Elect": { "R": 255, "G": 255, "B": 0 },
    "Arrest-Jail": { "R": 255, "G": 153, "B": 51 },
    "Release-Parole": { "R": 255, "G": 80, "B": 80 },
    "Trial-Hearing": { "R": 255, "G": 51, "B": 153 },
    "Charge-Indict": { "R": 255, "G": 0, "B": 255 },
    "Sue": { "R": 153, "G": 102, "B": 255 },
    "Convict": { "R": 51, "G": 102, "B": 255 },
    "Sentence": { "R": 0, "G": 153, "B": 255 },
    "Fine": { "R": 0, "G": 255, "B": 255 },
    "Execute": { "R": 102, "G": 255, "B": 153 },
    "Extradite": { "R": 204, "G": 255, "B": 153 },
    "Acquit": { "R": 255, "G": 204, "B": 153 },
    "Pardon": { "R": 255, "G": 153, "B": 204 },
    "Appeal": { "R": 204, "G": 153, "B": 255 },
    "Meet": { "R": 153, "G": 204, "B": 255 },
    "Phone-Write": { "R": 102, "G": 204, "B": 255 }
}

var new_rgb_dict = {
    "Entity": entity_rgb,
    "Relation": relation_rgb,
    "Event": event_rgb
}

var selected_opacity = 0.8;
var unselected_opacity = 0.3;