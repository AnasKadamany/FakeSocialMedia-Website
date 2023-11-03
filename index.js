let CurrentPost=0;
let CurrentPage = 1;
let isLoadingPosts = false;
SetupUI()
GetPosts()

window.addEventListener('scroll', function () {
    if (!isLoadingPosts && (window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        // User has scrolled to the bottom, load the next page of posts
        CurrentPage++;
        GetPosts(CurrentPage); // Pass the current page number
    }
});
function toggleLoader(show=true){
    if(show){
        document.getElementById('Loader').style.visibility = 'visible';
    }
    else{
        document.getElementById('Loader').style.visibility = 'hidden';
    }
}
function GetPosts(CurrPage=1){
    let userData = JSON.parse(localStorage.getItem("current_user"));
    isLoadingPosts = true;
    toggleLoader(true)
    axios.get('https://tarmeezacademy.com/api/v1/posts?limit=3&page='+CurrPage)
    .then(function (response) {
      let posts=response.data.data;
      console.log(posts)
      let img=`https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg`;
        for(post of posts){
            let editDivId = `editDiv-${post.id}`;
            let Post_title="";
            if(post.title!=null||post.title!=undefined){
                Post_title=post.title
            }
            
            
            let content=`
            
                <div class="card mb-3 " style="cursor: pointer;">
                <div class="card-header ">
                    <div class="row">
                        <div class="col-10">
                            <img class="rounded-circle border border-secondary" src="${UPhoto(post.author)}" alt="" style="width: 50px;height: 50px;"">
                            <span class="m-2" onclick="OpenProfile(${post.author.id})" id="User-ID-${post.author.id}" style="font-weight: bold;">${post.author.name}</span>
                        </div>
                        <div class="col-1" id="editDiv-${post.id}">
                        </div>
                        <div class="col-1" id="DeleteDiv-${post.id}" >
                            
                        </div>
                    </div>
                    
                </div>
                <div class="card-body Post-Div" onclick="PostClicked(${post.id});">
                    <img src=${post.image} alt="" style="width: 100% ;height:500px;cursor: default;">
                    <h6 class="mt-2" style="color: #00000094;">${post.created_at}</h6>
                    <p class="title" style="font-size: 30px;margin-bottom: 0px;">${Post_title}</p>
                    <p class="Description">${post.body}</p>
                    
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg>
                        <span>(${post.comments_count}) Comments</span>
                        <span id="post-tag-${post.id}"></span>
                        
                    </div>
                </div>
                </div>`
            document.getElementById("posts").innerHTML+=content

            let CurrentPostTagsId=`post-tag-${post.id}`
            for(tag of post.tags){
                let tagsContent=`<button class="btn btn-sm rounded-5 " style="background-color:grey;color:white ">${tag.name}</button>`
                document.getElementById(CurrentPostTagsId).innerHTML+=tagsContent
            }
            if(userData && userData.id && userData.id == post.author.id){
                let EditID=`editDiv-${post.id}`
                let DeleteID=`DeleteDiv-${post.id}`
                document.getElementById(DeleteID).innerHTML=`<button type="button" class="btn-close" onclick="ShowDeleteModal(${post.id})" style="margin-top:10px;margin-left: 10px;" aria-label="Close"></button>`
                document.getElementById(EditID).innerHTML=`<button type="button" class="btn btn-primary" data-bs-toggle="modal" onclick="EditPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" style="margin-top:3px" data-bs-target="#exampleModal">
                edit
                </button>`
            }
            
            
        }
        isLoadingPosts = false;
    })
    .catch(function (error) {
        console.error("Error:", error);
        console.log("hello")
        isLoadingPosts = false;
    })
    .finally(function () {
        toggleLoader(false)
      });
}
function extractUserId(elementId) {
    const prefix = "User-ID-";
    if (elementId.startsWith(prefix)) {
        return elementId.substring(prefix.length);
    }
    return null; // Return null if the ID doesn't match the expected format
}
function OpenProfile(UserID){
    window.location.href = 'Profile.html?UserID=' + UserID;
}
function PostClicked(PostID){
    window.location.href = 'PostDetails.html?PostID=' + PostID;
}

function ShowDeleteModal (PostID){
    CurrentPost=PostID;
    let postModal = new bootstrap.Modal(document.getElementById("DeletePost-Modal"),{});
    postModal.toggle();
}





function DeletePost(){
    if(CurrentPost!=0){
        let userData = JSON.parse(localStorage.getItem("current_user"));
        let token = localStorage.getItem("User_token");
        const headers= {
            "Authorization": `Bearer ${token}`,
        };
        toggleLoader(true)
        axios.delete('https://tarmeezacademy.com/api/v1/posts/'+CurrentPost,{headers:headers})
        .then(function (response) {
            console.log('Post Deleted successfully:', response.data);
            setTimeout(function() {
                location.reload();
            }, 2000);
            ShowAlert('Post Deleted successfully', 'success');
        })
        .catch(function (error) {
            console.log(error)
           ShowAlert(error.response.data.message,"danger")
        })
        .finally(function () {
            toggleLoader(false)
          });
    }
    
}

function GetSpecificPost(PostId){
    toggleLoader(true)
    axios.get('https://tarmeezacademy.com/api/v1/posts/'+PostId)
    .then(function (response) {
        
        let post=response.data.data;
        let Post_title="";
            if(post.title!=null||post.title!=undefined){
                Post_title=post.title
            }
        console.log(post)
        let content=`
            <div class="card mb-3 ">
                <div class="card-header">
                    <img class="rounded-circle border border-secondary" src="${UPhoto(post.author)}" alt="" style="width: 50px;height: 50px;"">
                    <span class="m-2" style="font-weight: bold;">${post.author.name}</span>
                </div>
                <div class="card-body">
                    <img src=${post.image} alt="" style="width: 100% ;height:500px;cursor: default;">
                    <h6 class="mt-2" style="color: #00000094;">${post.created_at}</h6>
                    <p class="title" style="font-size: 30px;margin-bottom: 0px;">${Post_title}</p>
                    <p class="Description">${post.body}</p>
                    
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg>
                        <span>(${post.comments_count}) Comments</span>
                        <span id="post-tag-${post.id}"></span>
                        
                    </div>
                </div>
            </div>`
            document.getElementById("UserSpecificPost").innerHTML="";
        document.getElementById("UserSpecificPost").innerHTML=content;
    }) .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        toggleLoader(false)
      });
}



function SignIn() {
    let name = document.getElementById("UserName-input").value;
    let pass = document.getElementById("Pass-input").value;
    toggleLoader(true)
    axios.post('https://tarmeezacademy.com/api/v1/login', {
        username: name,
        password: pass
    })
    .then(function (response) {
        
            
        console.log(response.data.token);
        console.log("Sign in Successful");
        localStorage.setItem("User_token", response.data.token);
        localStorage.setItem("current_user", JSON.stringify(response.data.user));
        let modalInstance = bootstrap.Modal.getInstance(document.getElementById("login-modal"));
        modalInstance.hide();
        setTimeout(function() {
            location.reload();
        }, 2000);
        ShowAlert('You signed in successfully', 'success');
       
    })
    .catch(function (error) {
        console.log("SignIn Failed");
        console.log(error.response.data.message);
        ShowAlert(error.response.data.message, 'danger');
    })
    .finally(function () {
        toggleLoader(false)
      });
}
function SignUP() {
    let Name=document.getElementById("SignUpName").value;
    let Uname = document.getElementById("SignUpUserName").value;
    let pass = document.getElementById("SignUpPass").value;
    let Email = document.getElementById("SignUpEmail").value;
    let img=document.getElementById("Register-Picture").files[0]
    let formData=new FormData();
    formData.append("name",Name)
    formData.append("username",Uname)
    formData.append("password",pass)
    formData.append("email",Email)
    if(img){
    formData.append("image",img)
    }
    toggleLoader(true)
    axios.post('https://tarmeezacademy.com/api/v1/register',formData)
    .then(function (response) {
        
        console.log(response.data.token);
        console.log("Sign UP Successful");
        localStorage.setItem("User_token", response.data.token);
        localStorage.setItem("current_user", JSON.stringify(response.data.user));
        let modalInstance = bootstrap.Modal.getInstance(document.getElementById("Register-Modal"));
        modalInstance.hide();
        setTimeout(function() {
            location.reload();
        }, 2000);
        ShowAlert('You signedUP successfully', 'success');
    })
    .catch(function (error) {
        console.log("SignIn Failed");
        console.log(error.response.data.message);
        ShowAlert(error.response.data.message, 'danger');
        
    })
    .finally(function () {
        toggleLoader(false)
      });
    
}

function EditPostBtnClicked(PostObj){
    let post=JSON.parse(decodeURIComponent(PostObj))
    console.log(post)
    document.getElementById("Post-Submit").innerHTML="Update"
    document.getElementById("Modal-Title").innerHTML="Edit Post"
    document.getElementById("Post-Title").value=post.title
    document.getElementById("Post-Body").value=post.body
    document.getElementById("Post-ID-Input").value=post.id
    let postModal = new bootstrap.Modal(document.getElementById("Post-Modal"),{});
    postModal.toggle();
    
}
function CreatePostBtnClicked (){
    document.getElementById("Post-Submit").innerHTML="Create"
    document.getElementById("Modal-Title").innerHTML="Create Post"
    document.getElementById("Post-Title").value=""
    document.getElementById("Post-Body").value=""
    document.getElementById("Post-ID-Input").value=""
    let postModal = new bootstrap.Modal(document.getElementById("Post-Modal"),{});
    postModal.toggle();
}

function PostUpload(){
    
    let postId=document.getElementById("Post-ID-Input").value;
    let isCreate=postId==null || postId=="";
    let title=document.getElementById("Post-Title").value;
    let Body=document.getElementById("Post-Body").value;
    let image=document.getElementById("formFile").files[0];
    let userData = JSON.parse(localStorage.getItem("current_user"));
    let token = localStorage.getItem("User_token");
    const headers= {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
    };
    let url=""
    let formData=new FormData();
    formData.append("body",Body)
    formData.append("title",title)
    if(image){formData.append("image",image)}
    
    if(isCreate){
        
        url="https://tarmeezacademy.com/api/v1/posts"
    }
    else{
        
        formData.append("_method","put")
        url=`https://tarmeezacademy.com/api/v1/posts/${postId}`
    }
    toggleLoader(true)
    axios.post(url,formData,{headers:headers})
    .then(function (response) {
        console.log('Post created successfully:', response.data);
        let modalInstance = bootstrap.Modal.getInstance(document.getElementById("Post-Modal"));
        modalInstance.hide();
        setTimeout(function() {
            location.reload();
        }, 2000);
        ShowAlert('The Post Published Successfully', 'success');
    })
    .catch(function (error) {
       ShowAlert(error.response.data.message,"danger")
    })
    .finally(function () {
        toggleLoader(false)
      });
}






function ShowAlert(message, type) {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const appendAlert = (message, type) => {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('')
    
      alertPlaceholder.append(wrapper)
      setTimeout(() => {
        wrapper.remove();
    }, 2000);
    }
    
        appendAlert(message, type)
}
  function SignOut(){
    localStorage.removeItem("User_token")
    localStorage.removeItem("current_user")
    setTimeout(function() {
        location.reload();
    }, 2000); 
    ShowAlert("You Signed Out successfully", 'success');
  }


  function UPhoto(userData){
    if (userData.profile_image!="[object Object]") {
        return userData.profile_image
    }
    else{
        return `https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg`
    }
  }


  function SetupUI(){
        let postButton=document.getElementById("post-button")
        let token = localStorage.getItem("User_token");
        let loginDiv=document.getElementById("Login-Div")
        let LogoutDiv=document.getElementById("Logout-Div")
        let userData = JSON.parse(localStorage.getItem("current_user"));
        let ProfileBtn=document.getElementById('Profile-Btn');
        
        if(token==null){
            LogoutDiv.classList.add("d-none")
            postButton.classList.add("d-none")
            ProfileBtn.classList.add("d-none")

        }
        else{
            loginDiv.classList.add("d-none")
            let userData = JSON.parse(localStorage.getItem("current_user"));
            document.getElementById("NavUName").innerHTML=`<span id="NavUImg" class="m-2" style="font-size: large;font-weight: 500;">${userData.username}</span>`;
            if(userData.profile_image==null){
                document.getElementById("NavUImg").innerHTML=img;
            }else{
                document.getElementById("NavUImg").innerHTML=`<img class="rounded-circle border border-secondary" src=${UPhoto(userData)} alt="" style="width: 50px;">`;
                console.log(userData.profile_image)
            }
            
        }
        
    }
   
    const cardDivs = document.querySelectorAll(".Card-Div");
    cardDivs.forEach(function (card) {
        card.addEventListener("click", function () {
            alert("Hello");
        });
    });




