export function processRr(splittedLine, containsTtl, previousTtl, previousName, origin, ttl) {
    let rr = {};
    let totalLength = splittedLine.length;
    let isMx = Number(splittedLine[totalLength - 2]);

    switch (totalLength) {
        case 5: 
            for(let index = 0; index < totalLength; index++) {
                const element = splittedLine[index];
                if(!element.includes(".")) {
                    if(parseInt(element)) {
                        if(!isMx) {
                            containsTtl = true;
                            previousTtl = element;
                            splittedLine.splice(index, 1);
                        }
                        break;
                    }
                }

            }

            if(!isMx) {
                previousName = splittedLine[0];
                rr.class = splittedLine[1];
                rr.type = splittedLine[2];
                rr.data = splittedLine[3];
            }
            break;
        case 4:
            for (let index = 0; index < totalLength; index++) {
                const element = splittedLine[index];
                if (!element.includes('.')) {
                    if(parseInt(element)){
                        if(!isMx){  
                            containsTtl = true;
                            previousTtl = element;
                            splittedLine.splice(index, 1);
                        }
                    break;
                    }
                } 
            
            
            }
            
            if(containsTtl) { //Name is missing
                rr.class = splittedLine[0];
                rr.type = splittedLine[1];
                rr.data = splittedLine[2];
            } else {
                if(isMx){
                    previousName = "@";
                    rr.class = splittedLine[0];
                    rr.type = splittedLine[1];
                    rr.preference = splittedLine[2];
                    rr.data = splittedLine[3];
                } else {
                    previousName = splittedLine[0];
                    rr.class = splittedLine[1];
                    rr.type = splittedLine[2];
                    rr.data = splittedLine[3];
                } 
            }
            break;
        case 3:
            rr.class = splittedLine[0];
            rr.type = splittedLine[1];
            rr.data = splittedLine[2];
        
            break;
        case 2:
            break; 
        default:
            break; 
    }
    rr.name = previousName || origin;
    rr.ttl =  previousTtl || ttl;
    return [rr, previousName, previousTtl];
}