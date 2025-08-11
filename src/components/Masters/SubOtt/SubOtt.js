import React from "react";
import { useState, useMemo, useEffect } from "react";
import ListTable from "../../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import * as Action from "../../../actions/Masters/subott";
import Export from "../../utils/Export";
import { bindActionCreators } from "redux";

export default function SubOtt() {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [save, setSave] = useState(false);
  const { sub_ott_create ,sub_ott_update } = bindActionCreators(
    Action,
    dispatch
  );
  const user = useSelector((state) => state.layout.profile);
  const tempTableData = {
    tableTitle: "Sub Ott",
      deleteRecord: Action.sub_ott_delete,
        updateRecord: Action.sub_ott_status_update,
        deleteAccess: "true",
        onDeleteText: "Are you sure want to delete?",
        onUpdateText:
          "Are you sure ?",
    tableHead: [
      {
        id: "title",
        label: "Title",
      },
    //   {
    //     id: "currency_symbol",
    //     label: "Currency Symbol",
    //   },
       {
        id: "image",
        label: "Image",
        isImage: true,
      },
      {
        id: "status",
        label: "Status",
        // isButtonDisplay: true,
      },
      {
        id: "edit",
        label: "Update",
        // access: rights?.["Masters"]?.["edit"] == "true",
        isNewPopUpForm: true,
      },
    ],
    tableBody: [],
  };
  const [tableData, setTableData] = useState({ ...tempTableData });
  const sub_ott = useSelector((state) => state.masters.sub_ott);
  console.log(sub_ott ,"asdsadsadsa")
  useEffect(() => {
    dispatch(Action.all_sub_ott_list());
  }, [save]);
  useMemo(() => {
    if (sub_ott?.data) {
      const temp = tableData;
      temp.tableBody = sub_ott?.data;
      setTableData({ ...temp });
    }
  }, [sub_ott]);
  const [formStructure, setFormStructure] = useState(
    [
      {
        id: "1",
        type: "inputBox",
        // maxLength: 2,
        title: "Sub Ott",
        name: "title",
        placeholder: "Enter Sub Ott",
        // regex: /^[0-9\s\&]+$/,
        //
        required: true,
      },
      {
        id: "2",
        type: "inputBox",
        // maxLength: 2,
        title: "Ott Link",
        name: "link",
        placeholder: "Enter Sub Ott Link",
        // regex: /^[0-9\s\&]+$/,
        //
        required: true,
      },
    //    {
    //     id: "3",
    //     type: "inputBox",
    //     // maxLength: 2,
    //     title: "Sequence",
    //     name: "sequence",
    //     placeholder: "Enter Sequence name",
    //     regex: /^[0-9\s\&]+$/,
    //     // isCaps:true,
    //     display: "none",
    //     required: true,
    //   },
      {
        type: "file",
        name: "image",
        title: "Image",
        description: "Image size",
        image_size: "512 * 512 PX",
        accept: "image/*",
        size: 6,
      },
    ].filter((e) => e)
  );
//    useEffect(() => {
//       if (isEdit) {
//         const temp = formStructure;
//         temp[2]["display"] = "block";
//         setFormStructure([...temp]);
//       } else {
//         const temp = formStructure;
//         temp[2]["display"] = "none";
//         setFormStructure([...temp]);
//       }
//     }, [isEdit]);
  const handleSubmit1 = async (event) => {
          const data = new FormData();

    Object.keys(form)?.map((key) => data.append(key, form?.[key]));
    data.append("user", user?.id);
    if (isEdit) {
      const resData = await sub_ott_update(data);
      console.log(resData, "neweweweweweew");
      if (resData?.status === 200) {
        setIsModalOpen(false);
        setSave(!save);
        setForm({});
        // navigate("/masters/category/", { state: { formUpload: true } });
      } else {
        setForm(data);
        // setIsModalOpen(true)
      }
    } else {
      const resData = await sub_ott_create(data);
      if (resData?.status === 200) {
        setForm({});
        setIsModalOpen(false);
        setSave(!save);
        // navigate("/masters/category/", { state: { formUpload: true } });
      } else {
        setForm(data);
        // setIsModalOpen(true)
      }
    }
  };

  return (
    <>
      <ListTable
        tableData={tableData}
        key={"ListTable"}
        form={form}
        setForm={setForm}
        setTableData={setTableData}
        setIsEdit={setIsEdit}
        view="view_all"
        save={save}
        setSave={setSave}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isPopUpNewTable={true}
        formStructure={formStructure}
        formTitle={isEdit ? "Edit Sub Ott" : "Add Sub Ott"}
        onSubmit={handleSubmit1}
        initialData={editingIndex !== null ? tableData[editingIndex] : {}}
        exportButton={
          <Export
            fileName={"Sub Ott"}
            isClubed={true}
            access={"true"}
            exportData={tableData?.exportData || tableData?.tableBody}
            headings={tableData.tableHead?.map((value) => value.label)}
            // api = {"export_episode_list"}
            // api_data = {episodes?.filter_condition}
          />
        }
      />
    </>
  );
}
