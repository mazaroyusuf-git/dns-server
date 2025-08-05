import fs from "fs";
import readline from "readline";

async function processBindFile(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
}

let origin;
let ttl;
let previousTtl;
let previousName;

let record = [];
let recordsType = ["NS", "A", "CNAME", "MX"];
recordsType.forEach(element => {
    records[element] = [];
})

let soa = {};
let soaLine = 0;
let multiLineSoa = false;

let containsTtl = false;

for await (const line of rl) {
    if (line.length > 1) {

    }
} //mengecek apakah master file tidak empty saat dibaca oleh readline

let commentedLine = false;
let l = line.trim().replace(/\t/g, " ").replace(/\s+/g, " ");

let commentIndex = l.indexOf(";");
if (commentIndex != -1) {
    if(commentIndex != 0) {
        let m = l.split(";");
        l = m[0];
    } else {
        commentedLine = true;
    }
}

if (!commentedLine) {
    let splittedLine = l.split(" ");
    switch (splittedLine[0]) {
        case "$ORIGIN":
            origin = splittedLine[1];
            break;

        case "$TTL":
            ttl = splittedLine[1];
            break;

        case "$INCLUDE":
            break;

        default:
            if(splittedLine.include("SOA")) {
                previousName = splittedLine[0];
                soa.mname = splittedLine[3];
                soa.rname = splittedLine[4]

                if(splittedLine.includes(')')) {
                    soa.serial = splittedLine[6];
                    soa.refresh = splittedLinep[7];
                    soa.entry = splittedLine[8];
                    soa.expire = splittedLine[9];
                    soa.title = splittedLine[10];
                } else {
                    multiLineSoa = true;
                    soaLine++;
                }
            }
    }
}

if(multilineSoa) {
    switch (soaLine) {
        case 2:
            console.log(splittedLine);
            soa.serial = splittedLine[0];
            break;
        case 3:
            soa.refresh = splittedLine[0];
            break;
        case 4:
            soa.retry = splittedLine[0];
            break;
        case 5:
            soa.expire = splittedLine[0];
            break;
        case 6:
            soa.ttl = splittedLine[0];
            break;
        default:
            break;
    }

    console.log(splittedLine);
    if (splittedLine.includes(')')) {
        multiLineSoa = false;
    }

    soaLine++;
}

recordsType.forEach(element => {
    if (splittedLine.includes(element)) {
        let type = element;

        let rr;

        [rr, previousName, previousTtl] = processRr(splittedLine, containsTtl, previousTtl, previousName, origin, ttl);
        records[type].push(rr);
    }
})