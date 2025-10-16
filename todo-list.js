        let valid_name= "yes"
        valueDropDown=0;
        
        let TaskNameList = [];
        let seenBefore= false
        valueContainer="PersonName";
        let dropDownNameArray=[];
        let taskByDate= [];
        let taskByDateCount=0;
        let taskByName=[];
        let taskNum=1;
        let saveOption=[]
        let emptyArry=[]
        let loadContentTasksValue= false
        let begining = true


        function add_to_dropdown(newName) {
            if (newName === "") {
                alert("Please enter a name.");
                valid_name="no"
            }
            $("option").each(function(){
                let lowerCaseCompare= $(this).text().toLowerCase() 
                if (newName.toLowerCase() === lowerCaseCompare){
                    alert("This name already exist!");
                    valid_name="no"
                    }
            })
            if(valid_name==="yes"){
            valueDropDown++; 
            saveOption.push(newName)
            let addOption = document.createElement('option');
            $("#addOption").val("valueDropDown");
            $(addOption).text(newName);

            dropDownNameArray.push(addOption);
            //console.log(addOption)
            dropDownNameArray.sort((a, b) => {
                return $(a).text().localeCompare($(b).text());
            });
            
            
            
            
            $("#container").append(dropDownNameArray)
            saveContentDropDown();
            
    
            }
            valid_name= "yes"
        }

    

        function add_Task(chosenName,addingTask,addingDate){
            $("#empty-task").hide();
            $("#cleared-empty-task").hide(); 
            seenBefore= false
            for (let i = 0; i < TaskNameList.length; i++) {
                if(chosenName===TaskNameList[i]){
                    let addToContainer = document.getElementById("new" + chosenName);
                    //console.log(TaskNameList[i])
                    let newOneTask= $('<div class="one-task">')
                    newOneTask.id = chosenName + "task" + taskNum;
                    taskNum++
                    let newTheTask= $('<span class="theTaskClass">')
                    $(newTheTask).text(addingTask);
                    let newTheTaskDate= $('<span class="theTaskDateClass">')
                    $(newTheTaskDate).html("Due: " + addingDate);
                    newTheTaskDate.attr('id', addingDate);


                    let cheackBox= $('<input type="checkbox" class="checkbox-box">') 
                    $(newOneTask).append(newTheTask)
                    
                    $(newOneTask).append(newTheTaskDate)
                    
                    $(newOneTask).append(cheackBox)

                    taskByDate.push({person:chosenName, date: addingDate, taskID: newOneTask.id, box: newOneTask})
                   
                    let filtered = taskByDate.filter(task => task.person === chosenName);

                    filtered.sort((a, b) => {
                        return (new Date(a.date) - new Date(b.date));
                    })

                    filtered.forEach(task => {
                        //console.log(task.box)
                        $(addToContainer).append(task.box)
                    });
                    $(addToContainer).show()
                    saveContentTasks();

                    seenBefore=true
                }
            }

            if(seenBefore!==true){
                valueContainer="new"+chosenName
                let newOneTaskContainer= $('<div class="oneTaskContainer">')
                newOneTaskContainer.attr('id', valueContainer);
                taskByName.push(newOneTaskContainer)
                taskByName.sort((a, b) => {
                    return $(a).attr('id').localeCompare($(b).attr('id'));
                });
                $("#all-tasks").append(taskByName)
                let newTaskName= $('<p class="name">')
                $(newTaskName).text(chosenName);
                $(newOneTaskContainer).append(newTaskName)
                let newOneTask= $('<div class="one-task">')
                newOneTask.attr('id', "one task"+ chosenName);
                $(newOneTaskContainer).append(newOneTask)
                let newTheTask= $('<span class="theTaskClass">')
                $(newTheTask).text(addingTask);
                $(newOneTask).append(newTheTask)
                let newTheTaskDate= $('<span class= "theTaskDateClass">')
                newTheTaskDate.attr('id', addingDate + taskByDateCount);
                taskByDateCount++; 
                $(newTheTaskDate).text("Due: " + addingDate);
                $(newOneTask).append(newTheTaskDate)
                let cheackBox= $('<input type="checkbox" class="checkbox-box">')
                $(newOneTask).append(cheackBox)
                TaskNameList.push(chosenName)
                taskByDate.push(newOneTask);
                taskByDate.push({person:chosenName, date: addingDate, taskID: newOneTask.id, box: newOneTask})
                saveContentTasks();
            } 
        }


        function checkValid(chosenName,addingTask,addingDate){
            if (names.value === "0") {
                alert("Please enter a teammate name.");
                return false;
                
            }
            if (addingTask === "") {
                alert("Please enter a task.");
                return false;
            }
            if (addingDate === "") {
                alert("Please enter a due date.");
                return false;
            }
            let today = new Date();
            let formatDate = new Date(addingDate)
            if (formatDate < today){
                alert("Due date passed. please enter a valid date.");
                return false;
            }
            else{
                return true;
            }
        }


        function reset(loadContentTasksValue) {
            for (let i = 0; i < TaskNameList.length; i++) {
                let addToContainer = document.getElementById("new" +   TaskNameList[i]);
                addToContainer.remove();  
                localStorage.clear(); 
            }
            //localStorage.clear(); 
            valid_name= "yes"
            valueDropDown=0;
            TaskNameList = [];
            seenBefore= false
            valueContainer="PersonName";
            dropDownNameArray=[];
            taskByDate= [];
            taskByDateCount=0;
            taskByName=[];
            taskNum=1;

            let defaultOption = $('<option disabled selected value="0">Assign to</option>');
            $("#container").html(defaultOption)
            if (loadContentTasksValue === true) {
                $("#empty-task").hide(); 
                $("#cleared-empty-task").show(); 
                
            } else {
                $("#empty-task").show(); 
                $("#cleared-empty-task").hide();
                if(begining!==true){
                    $("#container option:not(:first)").remove();
                    localStorage.clear("newNameList"); 
                    saveContentDropDown()

                }
            }   
        }

        function saveContentDropDown() {
            let options = $("#container option:not(:first)").map(function () {
                return $(this).val();
            }).get();
        

            let uniqueOptions = [...new Set(options)];

            localStorage.setItem('newNameList', JSON.stringify(uniqueOptions));
        }

        function LoadDropDownContent(){
            $("#container option:not(:first)").remove();
            saveOption= JSON.parse(localStorage.getItem('newNameList'))||[]
            saveOption.forEach(name=>{
                add_to_dropdown(name)

            })
        }


        function saveContentTasks() {
            let taskDataToSave = taskByDate.map(task => {
                let taskBox = $(task.box);
                return {
                    person: task.person,
                    date: task.date,
                    taskID: task.taskID,
                    content: taskBox.find('.theTaskClass').text(),
                    completed: taskBox.find('.checkbox-box').is(':checked')
                };
            });
        
            localStorage.setItem("savedTasks", JSON.stringify(taskDataToSave));
        }



        function loadContentTasks() {
            let saved = localStorage.getItem("savedTasks");
        
            if (!saved) return;
        
            let tasks = JSON.parse(saved);
        
            tasks.forEach(task => {
                if (!task.content || task.content.trim() === "") return;
        
                //console.log(task.person)
                add_Task(task.person, task.content, task.date);
            })
    
        }

        
        function saveContentTasksClear() {
            let filteredTaskData = taskByDate.filter(task => {
            return !$(task.box).hasClass('completed');
            }).map(task => {
                let taskBox = $(task.box);
                return {
                    person: task.person,
                    date: task.date,
                    taskID: task.taskID,
                    content: taskBox.find('.theTaskClass').text(),
                    completed: taskBox.find('.checkbox-box').is(':checked') // Should be false
                };
            });
            
            localStorage.setItem("savedTasks", JSON.stringify(filteredTaskData));
            loadContentTasksValue=true
            localStorage.setItem("loadContentTasksValue", JSON.stringify(loadContentTasksValue));
            location.reload(true);

            }
            
















        $(document).ready(function(){ 
        loadContentTasksValue = JSON.parse(localStorage.getItem("loadContentTasksValue"));
        //console.log(loadContentTasksValue)
            $(".person-task").hide(); 
            $(".name").hide(); 
            reset(loadContentTasksValue); 
            loadContentTasks();
            begining = false
            loadContentTasksValue = false;
            loadContentTasksValue = JSON.parse(localStorage.getItem("loadContentTasksValue"));
            
            
            
            $(document).on("change", ".checkbox-box", function () {
                let taskElement = $(this).closest(".one-task");
                //console.log("this elemet" +this)
                if (this.checked) {
                    alert("checked!");
                    taskElement.css("text-decoration", "line-through");
                    taskElement.addClass("completed"); 
                    saveContentTasks()


                }
                else{
                    taskElement.css("text-decoration", "none");
                    taskElement.removeClass("completed");
                    saveContentTasks()
                }
            })


            $("#add").click(function(){
                let newName = teamateName.value;
                $("#teamateName").val("");
                $("#DropDownValue").prop("disabled", true);

                add_to_dropdown(newName);
            })



            $("#assign").click(function(){
                let chosenName= names.value;
                let addingTask= task.value;
                let addingDate= date.value;
                if (checkValid(chosenName,addingTask,addingDate)=== true){    
                     add_Task(chosenName,addingTask,addingDate);  
                }
                seenBefore=false
                $("#task").val("");
                $("#date").val("");
                $("#names").val("0");
            })

           
            $('#clear').on('click', function () {
                if ($(".completed").length === 0) return;
                let newTaskByDate = []; 
                for (let i = 0; i < TaskNameList.length; i++) {
                    let addToContainer = document.getElementById("new" + TaskNameList[i]);
                    let uncompletedTasks = taskByDate.filter(task =>
                        task.person === TaskNameList[i] && !$(task.box).hasClass("completed")
                    );
                    let completedTasks = taskByDate.filter(task =>
                        task.person === TaskNameList[i] && $(task.box).hasClass("completed")
                    );
                    completedTasks.forEach(task => {
                        task.box.remove();
                    });
                    uncompletedTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
            
                    let newDataArray = uncompletedTasks.map(task => task.box);
            
                    if (newDataArray.length !== 0) {
                        $(addToContainer).html(newDataArray);
                    } else {
                        $(addToContainer).hide();
                        $("#cleared-empty-task").show();
                    }
                    newTaskByDate.push(...uncompletedTasks);
                }
                taskByDate = newTaskByDate;
                saveContentTasksClear();
            });


            $('#reset').on('click', function () {
                let confirmed = confirm("Are you sure you want to reset all teammates and to-do items?");
                if (confirmed) {
                    reset();
                }
            });


        })