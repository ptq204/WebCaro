const getRankBadge = (rank) => {
    let rankIcon = '';
    if (rank < 2000) {
        rankIcon = '/images/rank-beginner.png';
    }
    else if (rank < 4000) {
        rankIcon = '/images/rank-intermediate.png';
    }
    else if (rank < 6000) {
        rankIcon = '/images/rank-professional.png';
    }
    else if (rank < 8000) {
        rankIcon = '/images/rank-challenger.png';
    }
    else {
        rankIcon = '/images/rank-master.png';
    }
    return rankIcon;
}

module.exports = {
    getRankBadge: getRankBadge
}