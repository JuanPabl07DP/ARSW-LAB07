//@author hcadavid

apimock=(function(){

    var mockdata=[];

    mockdata["johnconnor"] = [
        {
            author: "johnconnor",
            points: [
                {"x": 150, "y": 120},
                {"x": 215, "y": 115},
                {"x": 178, "y": 190},
                {"x": 292, "y": 95}
            ],
            name: "house"
        },
        {
            author: "johnconnor",
            points: [
                {"x": 340, "y": 240},
                {"x": 15, "y": 215},
                {"x": 178, "y": 202},
                {"x": 121, "y": 115},
                {"x": 265, "y": 180}
            ],
            name: "gear"
        },
        {
            author: "johnconnor",
            points: [
                {"x": 78, "y": 120},
                {"x": 120, "y": 78},
                {"x": 190, "y": 78},
                {"x": 230, "y": 120},
                {"x": 230, "y": 180},
                {"x": 190, "y": 230},
                {"x": 120, "y": 230},
                {"x": 78, "y": 180}
            ],
            name: "octagon"
        }
    ];

    mockdata["maryweyland"] = [
        {
            author: "maryweyland",
            points: [
                {"x": 140, "y": 140},
                {"x": 115, "y": 115},
                {"x": 180, "y": 230},
                {"x": 250, "y": 170}
            ],
            name: "house2"
        },
        {
            author: "maryweyland",
            points: [
                {"x": 140, "y": 140},
                {"x": 115, "y": 115},
                {"x": 215, "y": 145},
                {"x": 190, "y": 190},
                {"x": 170, "y": 210}
            ],
            name: "gear2"
        },
        {
            author: "maryweyland",
            points: [
                {"x": 100, "y": 100},
                {"x": 200, "y": 100},
                {"x": 200, "y": 200},
                {"x": 100, "y": 200},
                {"x": 100, "y": 100}
            ],
            name: "square"
        },
        {
            author: "maryweyland",
            points: [
                {"x": 150, "y": 50},
                {"x": 250, "y": 150},
                {"x": 150, "y": 250},
                {"x": 50, "y": 150},
                {"x": 150, "y": 50}
            ],
            name: "diamond"
        }
    ];

    return {
        getBlueprintsByAuthor:function(authname,callback){
            callback(
                mockdata[authname]
            );
        },

        getBlueprintsByNameAndAuthor:function(authname,bpname,callback){

            callback(
                mockdata[authname].find(function(e){return e.name===bpname})
            );
        }
    }

})();

/*
Example of use:
var fun=function(list){
	console.info(list);
}

apimock.getBlueprintsByAuthor("johnconnor",fun);
apimock.getBlueprintsByNameAndAuthor("johnconnor","house",fun);*/