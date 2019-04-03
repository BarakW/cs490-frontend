import firebase from "firebase";

// Retrieves poster file from storage
export const getPoster = (posterId, storageRef, callback) => {
    const posterRef = storageRef.child("app-data/posters/" + posterId + ".jpg");
    posterRef.getDownloadURL().then(url => {
        callback(url);
    }).catch(console.error);
};

// Retrieves all movie information
export const getMovieDoc = (movieId, db, callback) => {
    const movieRef = db.collection("movies").doc(movieId);
    movieRef.get().then(doc => {
        if (doc.exists) {
            callback(doc.data());
        } else {
            console.error("Movie: ", movieId, " doesn't exist");
        }
    }).catch(console.error);
};

// Retrieves all user information
export const getUser = (userId, db, callback) => {
    const userRef = db.collection("users").doc(userId);
    userRef.get().then(doc => {
        if (doc.exists) {
            callback(doc.data);
        } else {
            console.log("User: ", userId, " doesn't exist");
        }
    }).catch(console.log);
};

// Add a user rating
export const addRating = (userId, movieId, score, db) => {
    const batch = db.batch();
    const userRef = db.collection("users").doc(userId);
    const ratingLoc = "ratings." + movieId;
    batch.update(userRef, {ratingLoc: score});
    batch.update(userRef, {stale: true});
    batch.commit();
};

// Remove a user rating
export const removeRating = (userId, movieId, db) => {
    const batch = db.batch();
    const userRef = db.collection("users").doc(userId);
    const ratingLoc = "ratings." + movieId;
    batch.update(userRef, {ratingLoc: firebase.firestore.FieldValue.delete()});
    batch.update(userRef, {stale: true});
    batch.commit();
}

// Listens to a user document and returns the unsubscribe function
export const addUserListener = (userId, db, callback) => {
    return db.collection("users").doc(userId).onSnapshot((doc) => {
        callback(doc.data());
    });
};