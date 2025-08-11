import React from "react";
import { useState, useMemo, useEffect } from "react";
import ListTable from "../../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import * as Action from "../../../actions/Masters/ottname";
import Export from "../../utils/Export";
import { bindActionCreators } from "redux";

export default function OttName() {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [save, setSave] = useState(false);
  const { ott_name_create, ott_name_update } = bindActionCreators(
    Action,
    dispatch
  );
  const user = useSelector((state) => state.layout.profile);
  const tempTableData = {
    tableTitle: "Ott Name",
    deleteRecord: Action.ott_name_delete,
    // updateRecord: Action.sub_ott_status_update,
    deleteAccess: "true",
    onDeleteText: "Are you sure want to delete?",
    onUpdateText: "Are you sure ?",
    tableHead: [
      {
        id: "ott_name",
        label: "Ott Name",
      },
      //   {
      //     id: "currency_symbol",
      //     label: "Currency Symbol",
      //   },

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
  const ott_name = useSelector((state) => state.masters.ott_name);
  useEffect(() => {
    dispatch(Action.all_ott_name_list());
  }, [save]);
  useMemo(() => {
    if (ott_name?.data) {
      const temp = tableData;
      temp.tableBody = ott_name?.data;
      setTableData({ ...temp });
    }
  }, [ott_name]);
  const [formStructure, setFormStructure] = useState(
    [
      {
        id: "1",
        type: "inputBox",
        // maxLength: 2,
        title: "Ott Name",
        name: "ott_name",
        placeholder: "Enter Ott Name",
        // regex: /^[0-9\s\&]+$/,
        //
        required: true,
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

    if (isEdit) {
      const resData = await ott_name_update(form);
      console.log(resData, "neweweweweweew");
      if (resData?.status === 200) {
        setIsModalOpen(false);
        setSave(!save);
        setForm({});
        // navigate("/masters/category/", { state: { formUpload: true } });
      } else {
        setForm({...form});
        // setIsModalOpen(true)
      }
    } else {
      const resData = await ott_name_create(form);
      if (resData?.status === 200) {
        setForm({});
        setIsModalOpen(false);
        setSave(!save);
        // navigate("/masters/category/", { state: { formUpload: true } });
      } else {
        setForm({...form});
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
        formTitle={isEdit ? "Edit Ott Name" : "Add Ott Name"}
        onSubmit={handleSubmit1}
        initialData={editingIndex !== null ? tableData[editingIndex] : {}}
        exportButton={
          <Export
            fileName={"Ott Name"}
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
