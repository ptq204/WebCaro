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

## **Game flow**  

<div align="center">
    <img src="images/caro-game-flow.png">
</div>  

## **Database schema**  

### **User**  
UserId: id  
Username: String  
Password: String  
Points: int
Rank: int
WinCount: int
LossCount: int
GamePlayed: [id-GameId]  

### **Game**  
GameId: id  
Creator: UserId-id  
CreatorName: string  
Result: int  
Winner: UserId-id  

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
    Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLzMzMDA0IiwidXNlcm5hbWUiOiJxdXllbnB0IiwidXNlcmlkIjozMzAwNCwiZXhwIjoxNTY3NTYzOTY5fQ.QHtTI8XFc3ghqbW1Z75AziUnLv_wyrmd_CIiFzs_qrM"
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
        rank: 0,
        winCount: 0,
        lossCount: 0
    },
    roomList: [
        {
            roomName: "Game 01",
            creator: "83df29a48249b51fe0f5c07e",  
            creatorName: "quyenpt",
            createdAt: "Thu Aug 15 2019 09:40:23",
        },
        {
            rooName: "Game 02",
            creator: "83df29a48249b5dwqe23eo03",
            creatorName: "nghipt", 
            createdAt: "Thu Aug 15 2019 09:33:51",
        },
        ...
    ]
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

## **Logic**  

Update event:  
- When room is full (status = 1) => server emit event 'room-full' => display 'Live' button for that room.   
- 'game_ack': server emit 'room-start-playing' to display button 'Live'.  
- When watch live => need only to query information (username, rank) of "opponent" because we already have that information of creator. client emit event 'query-opponent' and then catch the event 'opponent-live' from server.  
- If game end => server emit event 'room-full'

## **User interface**  

See here: [Caro Web UI](https://www.figma.com/file/WNEsKYXfPxXJ0sr8HsB76z/CaroWeb?node-id=0%3A1)  



