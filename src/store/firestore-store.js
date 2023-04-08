import { makeObservable, action, observable } from "mobx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import db from "../firebase";
import authStore from "./auth-store";
import apiStore from "./api-store";

export class firestoreStoreImplementation {
  favourite_list = [];
  favourite_data = [];

  constructor() {
    makeObservable(this, {
      favourite_list: observable,
      postFavouriteAPI: action.bound,
      fetchFavouriteList: action.bound,
      getFavouriteList: action.bound,
    });
  }

  postFavouriteAPI(props) {
    let tmp_favorite_list = Array.from(this.favourite_list);

    if (props) {
      if (tmp_favorite_list.includes(props)) {
        tmp_favorite_list.splice(tmp_favorite_list.indexOf(props), 1);
      } else {
        tmp_favorite_list.push(props);
      }

      const email = authStore.user;
      const docRef = db.collection("user_data").doc(email);

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document exists!");
            docRef
              .update({
                favourite_list: tmp_favorite_list,
              })
              .then(() => {
                console.log("Document updated successfully!");
              })
              .catch((error) => {
                console.log("Error updating document:", error);
                toast.error(error.message);
              });
          } else {
            console.log("Document does not exist!");
            docRef
              .set({
                favourite_list: props,
              })
              .then(() => {
                console.log("Document created successfully!");
              })
              .catch((error) => {
                console.log("Error creating document:", error);
                toast.error(error.message);
              });
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  }

  fetchFavouriteList() {
    const email = authStore.user;
    const docRef = db.collection("user_data").doc(email);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.favourite_list = doc.data().favourite_list;
          console.log("Favourite list:", this.favourite_list);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  getFavouriteList() {
    const newArray = apiStore.coin_list
      .filter((item) => this.favourite_list.includes(item.id))
      .map((item) => ({
        ...item,
      }));
    console.log(newArray);
    this.favourite_data = newArray;
  }
}

const fireStore = new firestoreStoreImplementation();

export default fireStore;
