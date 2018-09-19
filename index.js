
let dataSource = [
    { "id": "15305130530",
      "name": "分组一", 
      "children": [ { "id": "1@DEFAULT", "name": "1-001" }, { "id": "2@DEFAULT", "name": "1-002" }, { "id": "5@DEFAULT", "name": "1-003" } ] 
    }, 
    { "id": "15305130801", 
      "name": "分组二", 
      "children": [ { "id": "0@DEFAULT", "name": "2-001" }, { "id": "3@DEFAULT", "name": "2-002" }, { "id": "4@DEFAULT", "name": "2-003" } ] 
    }
];

const groupNames = dataSource.map((data) => {
    return data.name;
});

const childrenOptionsNames = dataSource.map((data) => {
    return data.children.map((child)=>{
        return child.name;
    });
});

let groupContainer  = document.getElementById('container');

// 构建列表
const createList = (data, category, groupIndex, childIndex) => {
    let list = document.createElement('li');
    list.setAttribute("data-list-value", data.name);
    let checkboxInput = document.createElement('input');
    checkboxInput.setAttribute("type", "checkbox");
    checkboxInput.setAttribute("id", data.id);
    checkboxInput.setAttribute("name", data.id);
    checkboxInput.setAttribute("data-checkVal", data.name);

    let checkboxLabel = document.createElement('label');
    checkboxLabel.setAttribute("for", data.id);
    checkboxLabel.textContent = data.name;
    if (category === 'group') {
        checkboxInput.setAttribute("data-category", "group");
        checkboxLabel.setAttribute("data-category", "group");
        list.setAttribute("id", `group-${groupIndex}`);
    } else if (category === 'children') {
        checkboxInput.setAttribute("data-category", "children");
        checkboxLabel.setAttribute("data-category", "children");
        list.setAttribute("id", `group-${groupIndex}-${childIndex}`);
    }
    list.appendChild(checkboxInput);
    list.appendChild(checkboxLabel);
    return list;
};

const handleGroupListClick = (event) => {
    let hasCategoryAttribute = event.target.getAttribute("data-category");
    if (hasCategoryAttribute && hasCategoryAttribute.toLowerCase() === 'group' && event.target.tagName.toLowerCase() === "input") {
        let checkedValue = event.target.checked;
        let groupUl = event.target.parentElement.getElementsByTagName("ul")[0];
        let allCheckboxesInSameGroup = groupUl.getElementsByTagName('input');
        [].slice.apply(allCheckboxesInSameGroup).forEach((eachBox) => {
            eachBox.checked = checkedValue;
        });
    }
};

const handleSameGroupChildrenListClick = (event) => {
    let groupUl = event.target.parentElement.parentElement;
    let allChecked = true;
    let noneChecked = true;
    let allCheckboxesInSameGroup = groupUl.getElementsByTagName('input');
    [].slice.apply(allCheckboxesInSameGroup).forEach((checkBox) => {
        if (checkBox.checked) {
            noneChecked = false;
        } else {
            allChecked = false;
        }
    });

    [].slice.apply(groupUl.parentElement.children).forEach((item)=>{
        if (item.tagName.toLowerCase() === 'input') {
            let groupCheckBox = item;
            if (!allChecked && !noneChecked) {
                groupCheckBox.indeterminate = true;
                groupCheckBox.checked = false;
            }
            else {
                groupCheckBox.indeterminate = false;
                if (allChecked) {
                    groupCheckBox.checked = true;
                }
                if (noneChecked) {
                    groupCheckBox.checked = false;
                }
            }
        }
    });
};

let fragment = document.createDocumentFragment();
dataSource.forEach((data, groupIndex)=>{
    let groupList = createList(data, 'group', groupIndex);
    groupList.addEventListener('click', handleGroupListClick);
    let innerUl = document.createElement('ul');
    data.children.forEach((child, childIndex)=>{
        let childrenList = createList(child, 'children', groupIndex, childIndex);
        childrenList.addEventListener('click', handleSameGroupChildrenListClick);
        innerUl.appendChild(childrenList);
    });
    groupList.appendChild(innerUl);
    fragment.appendChild(groupList);
});

groupContainer.appendChild(fragment);

document.getElementById('clear').addEventListener('click', (e) => {
    [].slice.apply(document.getElementsByTagName('input')).forEach((inputbox)=>{
        if (inputbox.type === 'checkbox') {
            inputbox.checked = false;
            inputbox.indeterminate = false;
        }
    })
});

document.getElementById('selectAll').addEventListener('click', (e) => {
    [].slice.apply(document.getElementsByTagName('input')).forEach((inputbox)=>{
        if (inputbox.type === 'checkbox') {
            inputbox.checked = true;
            inputbox.indeterminate = false;
        }
    })
});

let delayInput = -1;

//实现0.8秒键盘输入搜索延迟，防止用户快速输入，仅在停止输入，0.8秒间隔后进行搜索
const debounceFn = (event) => {
    clearTimeout(delayInput);
    let handleInput = (event) => {
        let inputVal = event.target.value.trim();
        let showEntireGroup = [];
        groupNames.forEach((name, index) => {
            if (name.indexOf(inputVal) > -1) {
                showEntireGroup.push(index);
                document.getElementById(`group-${index}`).style.display = 'block';
            } else {
                document.getElementById(`group-${index}`).style.display = 'none';
            }
        });

        childrenOptionsNames.forEach((group, groupIndex)=>{
            if (showEntireGroup.indexOf(groupIndex) === -1) {
                group.forEach((item, itemIndex)=>{
                    if (item.indexOf(inputVal) > -1) {
                        document.getElementById(`group-${groupIndex}`).style.display = 'block';
                        document.getElementById(`group-${groupIndex}-${itemIndex}`).style.display = 'block';
                    } else {
                        document.getElementById(`group-${groupIndex}-${itemIndex}`).style.display = 'none';
                    }
                })
            } else {
                group.forEach((item, itemIndex)=>{
                    document.getElementById(`group-${groupIndex}-${itemIndex}`).style.display = 'block';
                })
            }
        });
    };
    delayInput = setTimeout(handleInput.bind(null, event), 800);
};

document.getElementById('searchbox').addEventListener('input', debounceFn);

// 弹窗部分代码 modal window
let modal = document.getElementsByClassName("modal")[0];
let trigger = document.getElementsByClassName("trigger")[0];
let closeButton = document.getElementsByClassName("close-button")[0];

const toggleModal = () => {
    modal.classList.toggle("show-modal");
}

const documentOnClick = (event) => {
    if (event.target === modal) {
        toggleModal();
    }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
document.addEventListener("click", documentOnClick);

