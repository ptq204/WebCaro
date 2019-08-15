# **Application's description**  

## **Features**  

- Login
- Log out
- Register
- View ranking
- View available rooms
- Join room
- Play between two users
- Chat while playing
- [View game history] --> Don't see in requirements.  

## **Architecture logical view**  

<div align="center">
    <img src="images/architecture.png">
</div>  

## **Sequence diagram**  

### **Login**  

<div align="center">
    <img src="images/sequence_diagram_login.png">
</div>  

### **Register**  

<div align="center">
    <img src="images/sequence_diagram_register.png">
</div>  

## **Database schema**  

### **User**  
UserId: UUID  
Username: String  
Password: String  
Points: int
Rank: int
WinCount: int
LossCount: int
GamePlayed: [GameId-UUID]

### **Game**  
GameId: UUID
Creator: UserId-UUID
Result: int
Winner: UserId-UUID  

## **Restful APIs specification**  

### **POST** */users*  

**Description**: Register  
**Body**:  
```json
{
    username: "quyenpt",
    password: "quyenpt"
}
```  
**Response**:  
```json
{
    _id: {
        "$oid": "5c5029a48249b51fe0f5c07e"
    },
    username: "quyenpt",
    points: 0,
    rank: 0,
    winCount: 0,
    lossCount: 0
}
```  


### **POST** */login*  

**Description**: Login. Return a jwt.  
**Body**:  
```json
{
    username: "quyenpt",
    password: "quyenpt"
}
```  
**Response**:  
```json
{
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLzMzMDA0IiwidXNlcm5hbWUiOiJxdXllbnB0IiwidXNlcmlkIjozMzAwNCwiZXhwIjoxNTY3NTYzOTY5fQ.QHtTI8XFc3ghqbW1Z75AziUnLv_wyrmd_CIiFzs_qrM"
}
```  

### **GET** */*  

**Description**: Get information displayed on main page.  
**Header**:  
```json
{
    token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLzMzMDA0IiwidXNlcm5hbWUiOiJxdXllbnB0IiwidXNlcmlkIjozMzAwNCwiZXhwIjoxNTY3NTYzOTY5fQ.QHtTI8XFc3ghqbW1Z75AziUnLv_wyrmd_CIiFzs_qrM"
}
```  
**Response**:  
```json
{
    user: {
        _id: {
            "$oid": "5c5029a48249b51fe0f5c07e"
        },
        username: "quyenpt",
        points: 0,
        rank: 0,
        winCount: 0,
        lossCount: 0
    },
    roomList: [
        {
            roomName: "Game 01",
            creator: "83df29a48249b51fe0f5c07e",
            createdAt: "Thu Aug 15 2019 09:40:23",
        },
        {
            rooName: "Game 02",
            creator: "83df29a48249b5dwqe23eo03",
            createdAt: "Thu Aug 15 2019 09:33:51",
        },
        ...
    ]
}
```

### **POST** */games*  

**Description**: create new game room then return information of new game room.
**Header**:  
```json
{
    token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLzMzMDA0IiwidXNlcm5hbWUiOiJxdXllbnB0IiwidXNlcmlkIjozMzAwNCwiZXhwIjoxNTY3NTYzOTY5fQ.QHtTI8XFc3ghqbW1Z75AziUnLv_wyrmd_CIiFzs_qrM"
}
```
**Body**:  
```json
{
    room_name: "Go go go"
}
```  
**Response**:  
```json
{
    "_id": {
        "$oid": "5c5029a48249b51fe0f5c07e"
    },
    result: 0,
    winner: null
}
```  

### **GET** */ranks*  

**Description**: View rank list of players. Limit to 10 players.  
**Response**:  
```json
{
    rankList: [
        {
            username: "quyenpt",
            rank: 1999,
        },
        {
            username: "quyenpt01",
            rank: 1820,
        },
        {
            username: "quyenpt02",
            rank: 1766,
        }
        ...
    ]
}
```  


## **User interface**  

See here: [Caro Web UI](https://www.figma.com/file/WNEsKYXfPxXJ0sr8HsB76z/CaroWeb?node-id=0%3A1)



