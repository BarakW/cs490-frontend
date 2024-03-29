import firebase from "firebase";

// Retrieves poster file from storage
export const getPoster = (posterId, storageRef, callback, cbArgs) => {
    if (posterId === undefined) {
        console.error('poster not found')
        callback('https://i.ytimg.com/vi/Kjq6i_vUK5Q/hqdefault.jpg', cbArgs);
    } else {
        const posterRef = storageRef.child("app-data/posters/" + posterId + ".jpg");
        posterRef.getDownloadURL().then(url => {
            callback(url, cbArgs);
        }).catch(console.error);
    }
};

// Retrieves all movie information
export const getMovieDoc = (movieId, db, callback, cbArgs) => {
    const movieRef = db.collection("movies").doc(movieId);
    movieRef.get().then(doc => {
        if (doc.exists) {
            callback(doc, cbArgs);
        } else {
            console.error("Movie: ", movieId, " doesn't exist");
        }
    }).catch(console.error);
};

// Retrieves all user information
export const getUser = (userId, db, callback, cbArgs) => {
    const userRef = db.collection("users").doc(userId);
    userRef.get().then(doc => {
        if (doc.exists) {
            callback(doc, cbArgs);
        } else {
            console.log("User: ", userId, " doesn't exist");
        }
    }).catch(console.error);
};

// Add a user rating
export const addRating = (userId, movieId, score, db) => {
    const batch = db.batch();
    const userRef = db.collection("users").doc(userId);
    const ratingLoc = "ratings." + movieId;
    batch.update(userRef, {[ratingLoc]: score});
    batch.update(userRef, {stale: true});
    return batch.commit();
};

// Remove a user rating
export const removeRating = (userId, movieId, db) => {
    const batch = db.batch();
    const userRef = db.collection("users").doc(userId);
    const ratingLoc = "ratings." + movieId;
    batch.update(userRef, {[ratingLoc]: firebase.firestore.FieldValue.delete()});
    batch.update(userRef, {stale: true});
    batch.commit();
}

// Listens to a user document and returns the unsubscribe function
export const addUserListener = (userId, db, callback, cbArgs) => {
    return db.collection("users").doc(userId).onSnapshot((doc) => {
        callback(doc, cbArgs);
    }, (err) => console.error(err));
};