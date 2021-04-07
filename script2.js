class Team{
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.scores = [];
    }
}

class Season{
    constructor(teams){
        this.teams = teams;
        this.schedule = [];
        this.activePhase = -1;
    }

    addScores(weekScore){
        this.teams.forEach((team, index) => {
            team.scores.push(weekScore[index]);
        });
    }
    addPhase(phase){
        this.schedule.push(phase);
    }
    startNextPhase(){
        this.activePhase++;
    }
}
class League{
    constructor(startDay, numOfGames, name){
        this.teams = [];
        this.startDay = startDay;
        this.table = [];
        this.gameday = [];
        this.activeDay = -1;
        this.name = name;
    }
    addTeams(teams){
        for(let i = 0; i < teams.length; i++){
            this.teams.push(teams[i]);
        }
    }
    addGameDay(games){
        this.gameday.push(games);
    }
    initTable(){
        for(let i = 0; i < this.teams.length; i++){
            //this.table.push([0,0]);    
            this.table.push({ points : 0, goals : 0, id:this.teams[i].id});    
        }
    }
    displayGameDay(day){
        let element = `
        <div class="weekDay">
            <h3>${day + 1}η Αγωνιστική</h3>
            <div class="fixtures center">
                <ul>
        `;
        for(let i = 0; i < this.gameday[day].length; i++){
            element += `
                <li class="game">
                    <div class="teams">
                        <div class="team-info">${this.teams[this.gameday[day][i][0]].name}</div>
                        <div class="team-info">${this.teams[this.gameday[day][i][1]].name}</div>
                    </div>
                    <div class="score">
                        <div>${(day <= this.activeDay) ? this.teams[this.gameday[day][i][0]].scores[day + this.startDay] : 0 }</div>
                        <div>${(day <= this.activeDay) ? this.teams[this.gameday[day][i][1]].scores[day + this.startDay] : 0 }</div>
                    </div>
                </li>` ;   
        }

        element += "</ul></div></div>";

        $(".schedule").append(element);
    }
    displaySchedule(){
        for(let i = 0; i < this.gameday.length; i++){
            console.log("Day " + (i+1));
            this.displayGameDay(i);
        }
    }
    displayTable(){
        console.log(this.table);    
    }
    displayTableSort(){
        let rank = [...this.table];
        rank.sort(function (a, b) { 
            return (b.points != a.points ? b.points - a.points : b.goals - a.goals)});
        //console.log(rank);

        let element = '<div class="league-table prel center">';
        for(let i = 0;i < rank.length;i++){
            element += `
                <div class="team lt-${(i+1)}">
                <div class="rank">${(i+1)}</div>
                <div class="name">${this.teams[rank[i].id].name}</div>
                <div class="points">${rank[i].points}</div>
                <div class="goals">${rank[i].goals}</div>
            </div>
            `;
        }
        element += "</div>";

        $(element).insertAfter('.tables .table-headers');        
    }
    tableCalculate(){
        console.log("games : "+this.gameday.length);
        for(let i = 0; i <= this.activeDay; i++){
            for(let match = 0; match < this.gameday[i].length; match++){
                
                if(this.teams[this.gameday[i][match][0]].scores[this.startDay + i] > this.teams[this.gameday[i][match][1]].scores[this.startDay + i]){
                    this.table[this.gameday[i][match][0]].points += 3;
                    const dif = this.teams[this.gameday[i][match][0]].scores[this.startDay + i] - this.teams[this.gameday[i][match][1]].scores[this.startDay + i]
                    this.table[this.gameday[i][match][0]].goals += dif;
                    this.table[this.gameday[i][match][1]].goals -= dif;
                }else if(this.teams[this.gameday[i][match][0]].scores[this.startDay + i] < this.teams[this.gameday[i][match][1]].scores[this.startDay + i]){
                    this.table[this.gameday[i][match][1]].points += 3;
                    const dif = this.teams[this.gameday[i][match][1]].scores[this.startDay + i] - this.teams[this.gameday[i][match][0]].scores[this.startDay + i]
                    this.table[this.gameday[i][match][1]].goals += dif;
                    this.table[this.gameday[i][match][0]].goals -= dif;
                }else{
                    this.table[this.gameday[i][match][0]].points += 1;
                    this.table[this.gameday[i][match][1]].points += 1;
                }   
            }
        }
    }
    activeDayIncrease(){
        this.activeDay++;
    }
    getTeamFromTable(id, returnType){
        let rank = [...this.table];
        rank.sort(function (a, b) { 
            return (b.points != a.points ? b.points - a.points : b.goals - a.goals)});
        //console.log(rank[id]);
        //console.log(this.teams[rank[id].id]);
        if (returnType == "teamId") return this.teams[rank[id].id];
        if (returnType == "points") return rank[id];
    }
}

class SplitLeague extends League{
    constructor(startDay, numOfGames, name){
        super(startDay, numOfGames, name);
        this.table = {A : [],  B : []};
    }
    
    addGameDay(games){
        let temp = [];
        games.forEach(game => {
            if(game.length > 1){
                temp.push(game);
                // 5 => length / 2
                temp.push([game[0] + 5, game[1] + 5]);
            }else{
                temp.push([game[0], game[0] + 5]);
            }
        });
        this.gameday.push(temp);     
    }

    initTable(){
        for(let i = 0; i < (this.teams.length / 2); i++){
            //this.table.push([0,0]);    
            this.table.A.push({ points : 0, goals : 0, id:i});    
            this.table.B.push({ points : 0, goals : 0, id:i+5});    
        }
    }

    setTable(index, data){
        if(index < 5){
            this.table.A[index].points = data.points;     
            this.table.A[index].goals = data.goals;
            //this.table.A[index].id = data.id;         
        }else{
            this.table.B[index % 5].points = data.points;     
            this.table.B[index % 5].goals = data.goals; 
            //this.table.B[index % 5].id = data.id;         

        }
    }
    
    tableCalculate(){
        console.log("games : "+this.gameday.length);
        for(let i = 0; i <= this.activeDay; i++){
            for(let match = 0; match < this.gameday[i].length; match++){
                //console.log("day : " + i + " - match : " + match);
                if(this.teams[this.gameday[i][match][0]].scores[this.startDay + i] > this.teams[this.gameday[i][match][1]].scores[this.startDay + i]){
                    //this.table[this.gameday[i][match][0]].points += 3;
                    const dif = this.teams[this.gameday[i][match][0]].scores[this.startDay + i] - this.teams[this.gameday[i][match][1]].scores[this.startDay + i]
                    if(this.gameday[i][match][0] < 5){
                       // console.log("home win - gr A");
                        this.table.A[this.gameday[i][match][0]].points += 3; 
                        this.table.A[this.gameday[i][match][0]].goals += dif;   
                    }else{
                        //console.log("home win - gr B");

                        this.table.B[(this.gameday[i][match][0]-5)].points += 3; 
                        this.table.B[(this.gameday[i][match][0]-5)].goals += dif;    
                    }
                    if(this.gameday[i][match][1] < 5){
                        //console.log("away lose - gr A");
                        this.table.A[this.gameday[i][match][1]].goals -= dif;
                    }else{
                        //console.log("away lose - gr b");
                        this.table.B[(this.gameday[i][match][1]-5)].goals -= dif;
                    }
                    
                }else if(this.teams[this.gameday[i][match][0]].scores[this.startDay + i] < this.teams[this.gameday[i][match][1]].scores[this.startDay + i]){  
                    const dif = this.teams[this.gameday[i][match][1]].scores[this.startDay + i] - this.teams[this.gameday[i][match][0]].scores[this.startDay + i]
                    if(this.gameday[i][match][1] < 5){
                        //console.log("away win - gr A")
                        this.table.A[this.gameday[i][match][1]].points += 3; 
                        this.table.A[this.gameday[i][match][1]].goals += dif;   
                    }else{
                       // console.log("away win - gr B")
                        this.table.B[(this.gameday[i][match][1]-5)].points += 3; 
                        this.table.B[(this.gameday[i][match][1]-5)].goals += dif;    
                    }
                    if(this.gameday[i][match][0] < 5){
                        //console.log("home lose - gr A")
                        this.table.A[this.gameday[i][match][0]].goals -= dif;
                    }else{
                        //console.log("home lose - gr B")
                        this.table.B[(this.gameday[i][match][0]-5)].goals -= dif;
                    }
                }else{
                    
                    if(this.gameday[i][match][0] < 5 && this.gameday[i][match][1] < 5){
                        //console.log("draw - gr A");
                        this.table.A[this.gameday[i][match][0]].points += 1;
                        this.table.A[this.gameday[i][match][1]].points += 1;
                    }else if(this.gameday[i][match][0] > 4 && this.gameday[i][match][1] > 4){
                        //console.log("draw - gr B");
                        this.table.B[(this.gameday[i][match][0]-5)].points += 1;
                        this.table.B[(this.gameday[i][match][1]-5)].points += 1;
                    }else{
                        console.log("draw - mix game");
                        if(this.gameday[i][match][0] < 5){
                            this.table.A[this.gameday[i][match][0]].points += 1;
                            this.table.B[this.gameday[i][match][1]-5].points += 1;
                        }else{
                            this.table.A[this.gameday[i][match][1]].points += 1;
                            this.table.B[this.gameday[i][match][0]-5].points += 1;     
                        }
                    }
                }   
            }
        }    
    }

    displayTable(){
        console.log(this.table.A);    
        console.log(this.table.B);    
    }
    displayTableSort(){
        const table = Object.entries(this.table);
        //console.log(table);

        for(let i = 0; i < table.length; i++){
            let rank = [...table[i][1]];
            rank.sort(function (a, b) { 
                return (b.points != a.points ? b.points - a.points : b.goals - a.goals)});    
            //console.log(rank);
        
            console.log("display table sort");
            console.log(rank);

            let element = '<div class="league-table split-league center">';
            for(let i = 0;i < rank.length;i++){
                element += `
                    <div class="team lt-${(i+1)}">
                    <div class="rank">${(i+1)}</div>
                    <div class="name">${this.teams[rank[i].id].name}</div>
                    <div class="points">${rank[i].points}</div>
                    <div class="goals">${rank[i].goals}</div>
                </div>
                `;
            }
            element += "</div>";

            $(element).insertAfter('.tables .table-headers'); 
        }
        
    }
}

class Cup {
    constructor(knockout, name){
        this.teams = [];
        this.activeTeams = [];
        this.gameday = [];
        this.name = name;
        this.knockout = knockout;
        this.activeDay = -1;
    }

    addTeams(teams){
        for(let i = 0; i < teams.length; i++){
            this.teams.push(teams[i]);
        }
        this.initActiveTeams();
    }

    initActiveTeams(){
        this.teams.forEach((team, index) => {
            this.activeTeams[index] = true;
        });
    }

    getActiveTeams(){
        let count = 0;
        this.activeTeams.forEach(team => {
            if (team) count++;
        });
        console.log("Teams : "+ count);
        return count;
    }

    getRound(){
        if (this.getActiveTeams() > 8) return "Qualifying Round";
        if (this.getActiveTeams() == 8) return "Quarter Finals";
        if (this.getActiveTeams() == 4) return "Semi Finals";
        if (this.getActiveTeams() == 2) return "Final";
    }

    addGameDay(day, games){
        let gd = { day : -1, matches : []};
        gd.day = day;
        gd.matches.push(games);
        this.gameday.push(gd);
    }

    start(day){
        this.activeDay = day;
    }

    increaseDay(){
        this.activeDay++;
    }

    displaySchedule(){


        let element = ""; 

        for(let i = 0; i < this.gameday.length; i++){
            let day = this.gameday[i].day;
            element += `
            <div class="weekDay">
                <h3>${this.getRound()}</h3>
                <div class="fixtures center">
                    <ul>
            `;
            for(let j = 0; j < this.gameday[i].matches.length; j++){
                //console.log(this.gameday[i].matches[j]);   
                this.gameday[i].matches[j].forEach(game => {
                    //console.log(this.teams[game[0]].name + ' - ' + this.teams[game[1]].name);
                    element += `
                    
                    <li class="game">
                    <div class="teams">
                        <div class="team-info">${this.teams[game[0]].name}</div>
                        <div class="team-info">${this.teams[game[1]].name}</div>
                    </div>`;
                    
                    element += `
                        <div class="score">
                            <div>${(day <= this.activeDay) ? this.teams[game[0]].scores[day] : 0 }</div>
                            <div>${(day <= this.activeDay) ? this.teams[game[1]].scores[day] : 0 }</div>
                        </div>
                        `;
                        //console.log(this.teams[game[0]].scores[day] + ' - ' + this.teams[game[1]].scores[day]);    
                    if(this.knockout && day <= this.activeDay){
                        if(this.teams[game[0]].scores[day] > this.teams[game[1]].scores[day]){
                            this.activeTeams[this.teams[game[1]]] = false;
                        }else{
                            this.activeTeams[this.teams[game[0]]] = false;    
                        }
                        this.getActiveTeams();
                    }
                    //console.log(this.activeDay + " / " + day);
                    if(!this.knockout && this.activeDay <= (day + 1)){
                        element += `
                            <div class="score">
                                <div>${this.teams[game[0]].scores[day + 1]}</div>
                                <div>${this.teams[game[1]].scores[day + 1]}</div>
                            </div>
                            <div class="score">
                                <div>${this.teams[game[0]].scores[day] + this.teams[game[0]].scores[day + 1]}</div>
                                <div>${this.teams[game[1]].scores[day] + this.teams[game[1]].scores[day + 1]}</div>
                            </div>
                        `;
                        //console.log(this.teams[game[0]].scores[day + 1] + ' - ' + this.teams[game[1]].scores[day + 1]);  
                        //console.log((this.teams[game[0]].scores[day] + this.teams[game[0]].scores[day + 1]) + ' - ' + (this.teams[game[1]].scores[day] + this.teams[game[1]].scores[day + 1]));  
                        if(this.teams[game[0]].scores[day] + this.teams[game[0]].scores[day + 1] > this.teams[game[1]].scores[day] + this.teams[game[1]].scores[day + 1]){
                            this.activeTeams[this.teams[game[1]].id] = false;
                            //console.log("home qualified");
                            //console.log(this.teams[game[1]]);
                        }else{
                            this.activeTeams[this.teams[game[0]].id] = false;  
                            //console.log("away qualified");
                            //console.log(this.teams[game[0]]);

                        }
                        this.getActiveTeams();
                    }
                    element += `</li>`;
                })
            }
        }

        /*
        for(let i = 0; i < this.gameday[day].length; i++){
            element += `
                <li class="game">
                    <div class="teams">
                        <div class="team-info">${this.teams[this.gameday[day][i][0]].name}</div>
                        <div class="team-info">${this.teams[this.gameday[day][i][1]].name}</div>
                    </div>
                    <div class="score">
                        <div>${(day <= this.activeDay) ? this.teams[this.gameday[day][i][0]].scores[day + this.startDay] : 0 }</div>
                        <div>${(day <= this.activeDay) ? this.teams[this.gameday[day][i][1]].scores[day + this.startDay] : 0 }</div>
                    </div>
                </li>` ;   
        }
        */

        element += "</ul></div></div>";

        $("section."+this.name+"").append(element);
    }
}

let pet     = new Team(0, "Petoria Rotters");
let seven   = new Team(1, "Eptahori FC");
let bobo    = new Team(2, "Superbobo");
let pali    = new Team(3, "P@li");
let ro      = new Team(4, "Roulis FC");
let men     = new Team(5, "Lukakos");
let sid     = new Team(6, "Kailar");
let tosk    = new Team(7, "Den Isxyei");
let tsak    = new Team(8, "Dynamo Podilatou");
let mar     = new Team(9, "Alkoolikos Asteras");

const seasonOneTeams = [pet, seven, bobo, pali, ro, men, sid, tosk, tsak, mar];
let seasonOne = new Season(seasonOneTeams);

let prelimRound = new League(0, 4, "Round A");
seasonOne.addPhase(prelimRound);

seasonOne.addScores([55, 63, 56, 81, 61, 69, 55, 75, 56, 70]);
seasonOne.addScores([75, 58, 66, 84, 77, 58, 76, 71, 50, 66]);
seasonOne.addScores([57, 65, 45, 62, 65, 52, 40, 75, 30, 53]);
seasonOne.addScores([90, 71, 79, 59, 71, 58, 49, 41, 65, 79]);
/* knock start */
seasonOne.addScores([66, 40, 51, 47, 50, 49, 56, 69, 51, 52]);
seasonOne.addScores([94, 65, 77, 90, 85, 68, 51, 78, 78, 79]);
/* quarter finals */
seasonOne.addScores([35, 37, 41, 20, 45, 4, 20, 37, 38, 38]);



seasonOne.schedule[0].addTeams(seasonOne.teams);
seasonOne.schedule[0].initTable();
/*
let splitRound = new SplitLeague(4, 9);
seasonOne.addPhase(splitRound);


seasonOne.schedule[0].addTeams([pet, seven, tosk, pali, ro]);
seasonOne.schedule[0].addTeams([men, sid, bobo , tsak, mar]);
seasonOne.schedule[0].initTable();

seasonOne.schedule[0].addGameDay([[0, 1], [2, 3], [4]]);
seasonOne.schedule[0].addGameDay([[0, 2], [1, 4], [3]]);
seasonOne.schedule[0].addGameDay([[0, 4], [1, 3], [2]]);
seasonOne.schedule[0].addGameDay([[0, 3], [2, 4], [1]]);
seasonOne.schedule[0].addGameDay([[1, 2], [3, 4], [0]]);


seasonOne.schedule[0].activeDayIncrease();
seasonOne.schedule[0].activeDayIncrease();
seasonOne.schedule[0].activeDayIncrease();
seasonOne.schedule[0].activeDayIncrease();

seasonOne.schedule[0].tableCalculate();
seasonOne.schedule[0].displayTable();
seasonOne.schedule[0].displayTableSort();

*/

seasonOne.schedule[0].addGameDay([[0, 8], [2, 4], [5, 1], [6, 9], [3, 7]]);
seasonOne.schedule[0].addGameDay([[2, 1], [0, 4], [5, 9], [6, 3], [7, 8]]);
seasonOne.schedule[0].addGameDay([[0, 1], [2, 9], [5, 3], [6, 8], [4, 7]]);
seasonOne.schedule[0].addGameDay([[0, 9], [2, 3], [5, 8], [6, 4], [7, 1]]);

seasonOne.schedule[0].activeDayIncrease();
seasonOne.schedule[0].activeDayIncrease();
seasonOne.schedule[0].activeDayIncrease();
seasonOne.schedule[0].activeDayIncrease();

seasonOne.schedule[0].tableCalculate();
seasonOne.schedule[0].displayTable();


console.log("Round Two");

let splitRound = new SplitLeague(4, 9, "Round B");
seasonOne.addPhase(splitRound);


const roundTwoTeams = [];
for(let i = 0; i < 10; i+=2){
    roundTwoTeams.push(seasonOne.schedule[0].getTeamFromTable(i, "teamId"));
}
for(let i = 1; i < 10; i+=2){
    roundTwoTeams.push(seasonOne.schedule[0].getTeamFromTable(i, "teamId"));
}


//console.log(roundTwoTeams);
seasonOne.schedule[1].addTeams(roundTwoTeams);

seasonOne.schedule[1].initTable();

let index = 0;
for(let i = 0; i < 10; i+=2){
    const data  = seasonOne.schedule[0].getTeamFromTable(i, "points");
    seasonOne.schedule[1].setTable(index, data);
    index++;
}
console.log(index);
for(let i = 1; i < 10; i+=2){
    const data  = seasonOne.schedule[0].getTeamFromTable(i, "points");
    seasonOne.schedule[1].setTable(index, data);
    index++;
}

//seasonOne.schedule[1].displayTable();


seasonOne.schedule[1].addGameDay([[0, 1], [2, 3], [4]]);
seasonOne.schedule[1].addGameDay([[0, 2], [1, 4], [3]]);
seasonOne.schedule[1].addGameDay([[0, 4], [1, 3], [2]]);
seasonOne.schedule[1].addGameDay([[0, 3], [2, 4], [1]]);
seasonOne.schedule[1].addGameDay([[1, 2], [3, 4], [0]]);




seasonOne.schedule[1].activeDayIncrease();
seasonOne.schedule[1].activeDayIncrease();
seasonOne.schedule[1].activeDayIncrease();

seasonOne.schedule[1].displaySchedule();


seasonOne.schedule[1].tableCalculate();
seasonOne.schedule[1].displayTable();

seasonOne.schedule[1].displayTableSort()


//const seasonOneTeams = [pet, seven, bobo, pali, ro, men, sid, tosk, tsak, mar];
console.log("CUP");

let cup = new Cup(false, "CUP");
cup.addTeams(seasonOneTeams);
cup.addGameDay(4, [[6, 0], [5, 8]]);
cup.addGameDay(6, [[2, 4], [7, 9], [0, 8], [1, 3]]);
//cup.addGameDay(2, [[1, 6], [5, 4], [2, 3], [7,9]]);

cup.start(4);
cup.increaseDay();
cup.increaseDay();
//cup.increaseDay();
//cup.getActiveTeams();
//cup.displaySchedule();


console.log("LEAGUE CUP");

let lCup = new Cup(true, "League-CUP");
lCup.addTeams(seasonOneTeams);
lCup.addGameDay(4, [[0, 6], [8, 4]]);
lCup.addGameDay(6, [[7, 3], [5, 1], [0, 8], [2, 9]]);

lCup.start(4);
lCup.increaseDay();
lCup.increaseDay();
//lCup.getActiveTeams();

//lCup.displaySchedule();
