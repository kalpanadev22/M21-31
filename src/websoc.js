import axios from 'axios';


let socket = null;
let onDataReceivedCallback = null;

export const connectWebSocket = (callback, params) => {
    onDataReceivedCallback = callback;

    closeWebSocket("dfgh");
    if (!socket) {
        socket = new WebSocket(`ws://localhost:8087/RedisWebSoc/clientws?type=${params}`);

        socket.onopen = () => {
            console.log("Connected to WebSocket");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // console.log(data);
            onDataReceivedCallback(data);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
            socket = null;
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }
};

export const sendWebSocketMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.warn("WebSocket connection is not open.");
    }
};

export const closeWebSocket = (compName) => {
    if (socket) {
        socket.close();
        console.log(compName, " close con");
        socket = null;
    }
};




export const getLogs = async (tableName, offset) => {

    try {
        const response = await axios.get(`http://localhost:8087/RedisWebSoc/getlogs?table=${tableName}&offset=${offset}`);
        const data = await response.data;
        //console.log(data)
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }

}

export const getPrimaryKey = async (tableName) => {
    try {
        const response = await axios.get(`http://localhost:8087/RedisWebSoc/getprimkey?table=${tableName}`);
        const key = await response.data;
        // console.log(key);
        return key;
    } catch (error) {
        console.error(error);
        throw error;
    }
}