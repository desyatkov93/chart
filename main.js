(function(){

var firstWorking = true,
CTX = document.getElementById("TeamsChart").getContext("2d"),
TChart,
prevData = [];

getData();
setInterval(function(){getData()},5000);

function HexToRgb(hex){
	   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    	return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function checkData(oldDataArray, newDataArray){
	lng = oldDataArray.length;
	if(firstWorking){
		return true;
	}
	if(lng!=newDataArray.length){
		return true;
	}
	for(var i = 0; i<lng; i++){
			if(oldDataArray[i].scores != newDataArray[i].scores){
				return true;
			}
	}
	return false;
}

function highlight(color){
	var rgb = HexToRgb(color);
	return 'rgb(' + getColor(rgb.r) + ',' + getColor(rgb.g) + ',' + getColor(rgb.b) + ')';
}

function getColor(color){

	var DEEGREE = 20;
	if(color<255 - DEEGREE){
		return color += DEEGREE;
	}
	else{
		return 255;
	}
	
}

function generateData(teams){
	var data = [];

	var length = teams.length;
	for(var i = 0; i < length; i++){
		data.push(
			{
				value: teams[i]['scores'],
				color: teams[i]['color'],
				highlight: highlight(teams[i]['color']),
				label: teams[i]['name']
			}
		);
	}
	
	return data;
}

function getData(){
	$.ajax({
		url: 'ScoreBoard.php',
		type: 'POST',
		dataType: 'json',
		success: function(teams){
		
			if(checkData(prevData, teams)){
				prevData = teams;
				
				if(!firstWorking){
					TChart.destroy();
				}
				data = generateData(teams);
				TChart = getGraph(data);
				firstWorking = false;
			}
		}
	})
	.fail(function() {
		console.log("error");
	});
}

function getGraph(data){
	return new Chart(CTX).PolarArea(data,{});
}
	
})();