import { emailManagerNotification } from "../notificationsStructure/emailSendStructure.mjs";


export class defense{
    static ips = [];
    static ips_req_count = [];
    static ips_blocked = [];

    
    static async ip_filter({ip}){
        //console.log(this.ips, "   ", this.ips_req_count), "   ", this.ips_blocked;
        if(this.ips_blocked.includes(ip)){
            return { message: "Ip address was blocked, to many request in a short period of time", errorCode: 800, ok: false}
        }
        if(this.ips.includes(ip)){
            const ipIndex = this.ips.indexOf(ip);
            this.ips_req_count[ipIndex] = this.ips_req_count[ipIndex] + 1;
            
            this.ips_req_count.forEach(async ipReqCount => {
                if(ipReqCount > 49){
                    const ipIndex = this.ips_req_count.indexOf(ipReqCount);
                    this.ips_blocked.push(ip)
                    await emailManagerNotification.ipBlockNotification({ip})
                    return { message: "Your ip address reached the limit of request allow in a short period of time, your ip was blocked", errorCode: 801, ok: false}
                }
            });
            return { message: "Ip address access allow", ok :true}
            
        }
        else{
            this.ips.push(ip)
            this.ips_req_count.push(0)
            return { message: "Ip address access allow", ok :true}
        }
        
    }
}

setTimeout(function()  {
    defense.ips = [];
    defense.ips_req_count = [];
    //console.log("Ips and was clean")
}, 1000 * 60);
