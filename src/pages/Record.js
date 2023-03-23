import { useState } from "react";

import Category from "../components/Category";
import AudioRecord from "../components/AudioRecord";

import { dbService, storageService } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import {
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "@firebase/storage";

function Record() {
  const [hospital, setHospital] = useState("");
  const [categories, setCategories] = useState([]);
  const [soundFile, setSoundFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const getCategories = (categories) => {
    setCategories(categories);
    // console.log(categories, "!!!");
  };

  const getSoundFile = (soundFile) => {
    setSoundFile(soundFile);
  };

  console.log("파일 전달 확인!!", soundFile);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const soundFileRef = ref(storageService, "soundRecordFile");
    const response = await uploadBytes(soundFileRef, soundFile);

    const fileUrl = await getDownloadURL(response.ref);

    try {
      const docRef = await addDoc(collection(dbService, "records"), {
        hospitalName: hospital,
        categories: categories,
        createdAt: Date.now(),
        fileUrl,
      });
      setHospital("");
      setCategories([]);
      console.log("Document written with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding Document", error);
    }
  };

  const handleOnChange = ({ target: { value } }) => {
    setHospital(value);
  };

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <h1> 진료 내용 기록하기 </h1>
        <input
          name="hospital"
          type="text"
          value={hospital}
          placeholder="병원 이름을 입력해 주세요."
          onChange={handleOnChange}
        />
        <Category getCategories={getCategories} />
        <AudioRecord getSoundFile={getSoundFile} />
        <input type="submit" value="분석하기" />
      </form>
    </>
  );
}
export default Record;
