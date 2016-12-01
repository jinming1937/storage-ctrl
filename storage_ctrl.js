var storageCtrl = {
    /**
     * @param {String} key 
     */
    getSessionData: function(key) {
        return JSON.parse(sessionStorage.getItem(key));
    },
    /**
     * @param {String} key 
     * @param {Object} value
     */
    setSessionData: function(key, value) {
        return sessionStorage.setItem(key, JSON.stringify(value));
    },
    /**
     * @param {String} key 
     */
    getLocalData: function(key) {
        var data = JSON.parse(localStorage.getItem(key));
        if(!data['timeflag']){
            return data;
        }else if(data["timeflag"] && new Date(data["timeflag"]) > new Date()){
            return data.data;
        }else{
            return null;
        }
    },
    /**
     * @param {String} key 
     * @param {Object} value
     * @param {Number} minutes   
     */
    setLocalData: function(key, value, minutes) {
        if(typeof minutes === 'number'){
            var date = (new Date()).setMinutes(new Date().getMinutes()+minutes);
            localStorage.setItem(key, JSON.stringify( {data: value , timeflag: date}));
        }else{
            localStorage.setItem(key,JSON.stringify(value));
        }
    },
    /**
     * @param {String} key 
     */
    getCookieData: function(key) {
    	var val = JSON.parse(JSON.stringify(getcookie(key) || "")),
    		v;
    	try{
    		v = JSON.parse(val);
    	}	
    	catch(e){
    		v = val;
    	}
        return v;
    },
    /**
     * cookie 存对象要谨慎，它有4KB大小限制
     * @param {String} key 
     * @param {Object} value
     * @param {Number} minutes   
     */
    setCookieData: function(key, value, minutes) {
        var minutes = minutes || 20;/* 默认过期时间为20分钟 */
        var exp = new Date();
        exp.setTime(exp.getTime() + minutes * 1000);
        var finishString = key + "=" + escape(JSON.stringify(value)) + ";expires=" + exp.toGMTString() + ";path=/";
        var nowCookie = document.cookie;

        if(nowCookie.search(new RegExp(key,'g')) === -1 &&
           nowCookie.length + finishString.length >4*1024 ||
           nowCookie.search(new RegExp(key,'g')) > -1 &&
           nowCookie.replace(getcookie(key),"").length - key.length - 1 + finishString.length > 4* 1024
        ){
            throw("Error: out of cookie length");
        }else{
            document.cookie = finishString;
        }
    }
};

/**
 * @param {String} key 键名
 */
function checkKey(key , value, minutes){
    if(typeof key !== "string" || key.length === 0 || key.search(/\s/g) > -1){
        throw("Error: key is not a string");
    }
    if(typeof minutes !== "undefined" && typeof minutes !== "number"){
        throw("Error: minutes is not a number");
    }   
}

/**
 * @param {String} objname 对象名
 */
function getcookie(objname) {
    var arrstr = document.cookie.split("; ");
    for (var i = 0; i < arrstr.length; i++) {
        var temp = arrstr[i].split("=");
        if (temp[0] == objname) return unescape(temp[1]);
    }
}


module.exports = storageCtrl;