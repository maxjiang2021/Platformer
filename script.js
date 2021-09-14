var yV = 0;
var y = 0;
var obstacles = [];
var debugInfo = null;
function colliding ($div1, $div2) {
    // Div 1 data
    var d1_offset = $div1.offset();
    var d1_height = $div1.outerHeight(true);
    var d1_width = $div1.outerWidth(true);
    var d1_distance_from_top = d1_offset.top + d1_height;
    var d1_distance_from_left = d1_offset.left + d1_width;

    // Div 2 data
    var d2_offset = $div2.offset();
    var d2_height = $div2.outerHeight(true);
    var d2_width = $div2.outerWidth(true);
    var d2_distance_from_top = d2_offset.top + d2_height;
    var d2_distance_from_left = d2_offset.left + d2_width;

    var not_colliding = (d1_distance_from_top < d2_offset.top || d1_offset.top > d2_distance_from_top || d1_distance_from_left < d2_offset.left || d1_offset.left > d2_distance_from_left);

    // Return whether it IS colliding
    return !not_colliding;
};

var canJump = true;
var vRun = true;
var gameOver = null;
var score = 0;
var finalScoreDiv = null;
var lastFrame = (new Date()).getTime()
function restart(){
    gameOver.hidden = true;
    y = 0;
    yV = 0;
    for (let i of obstacles) {
        document.body.removeChild(i);
        obstacles.splice(obstacles.indexOf(i), 1);
    }
    canJump = true;
    vRun = true;
    let newBlock = document.createElement("div")
    newBlock.className = "block"
    newBlock.style.width = "1000px"
    newBlock.style.left = `${window.innerWidth / 2}px`;
    newBlock.style.top = `${window.innerHeight - 200}px`
    document.body.appendChild(newBlock);
    obstacles.push(newBlock);
}
window.addEventListener("load", () => {
    debugInfo = document.getElementById("debugInfo")
    finalScoreDiv = document.getElementById("finalScore")
    var player = document.getElementById("player")
    gameOver = document.getElementById("gOver")
    var scoreDisplay = document.getElementById("score")
    window.addEventListener("keydown", (e) => {
        if (e.key == "r" && (!vRun)){
           restart() 
        }
        if (e.key == "F2"){
            debugInfo.classList.toggle("hidden")
            document.getElementById("adv").hidden = true
        }
        if (vRun){
            if (e.key == " " && canJump) {
                yV = 50;
                canJump = false;
            }
        }
    })
    window.addEventListener("click",()=>{
        if (vRun){
            yV = 50;
            canJump = false;
        }
    })
    setInterval(() => {
        if (vRun){
            let thisFrame = (new Date()).getTime()
            debugInfo.innerText = `
            FPS: ${Math.round(1000/(thisFrame - lastFrame))}
            Frame Delay: ${(thisFrame - lastFrame)-40}ms
            HTML Elements: ${document.body.getElementsByTagName('*').length}
            Platforms: ${document.getElementsByClassName("block").length}
            Player Y: ${y}
            Y Velocity: ${yV} 
            `
            lastFrame = thisFrame
            yV -= 3;
            y -= yV;
            player.style.top = `${y}px`;
            if (y > window.innerHeight - 100) {
                y = window.innerHeight - 100;
            }
            if (y < 0) {
                y = 0;
                yV = 0;
            }
            for (let i of obstacles){
                i.style.left = `${parseInt(i.style.left)-15}px`;
                if (parseInt(i.style.left)+parseInt(i.style.width) <= 0){
                    document.body.removeChild(i);
                    obstacles.splice(obstacles.indexOf(i),1);
                }
                if (colliding($(player),$(i))){
                    // Player standing on top of block
                    if (player.style.top+100 < i.style.top){
                        player.style.top = i.style.top-100;
                        y = parseInt(i.style.top) - 100;
                        yV = 2;
                        canJump = true;
                        i.style.backgroundColor = "red"
                        console.log("Top")
                    } else{ // Player hit the side
                        yV = 3;
                        i.style.backgroundColor = "yellow"
                        console.log("Hit")
                    }
                }
                scoreDisplay.innerHTML = "Score: "+score;
            }
            score+=1;
            if (y>=window.innerHeight-100){
                vRun = false;
                gameOver.hidden = false;
                finalScoreDiv.innerText = "Final Score: " + (score-1);
                score = 0;
            }
        }
    }, 40)
    let newBlock = document.createElement("div")
    newBlock.className = "block"
    newBlock.style.left = `${window.innerWidth - 100}px`;
    newBlock.style.top = `${window.innerHeight - 200}px`
    document.body.appendChild(newBlock);
    obstacles.push(newBlock);
    var bML = () => {
        if (vRun) {
            let newBlock = document.createElement("div")
            newBlock.className = "block"
            newBlock.style.left = `${window.innerWidth - 100}px`;
            newBlock.style.top = `${window.innerHeight - Math.random()*500}px`
            newBlock.style.width = `${Math.random()*200+50}px`
            document.body.appendChild(newBlock);
            obstacles.push(newBlock);
        }
        setTimeout(bML,100+(Math.random()*1500))
    };
    bML()
    
})