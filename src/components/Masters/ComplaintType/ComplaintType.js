import { useState, useMemo, useEffect } from "react";
import ListTable from "../../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Export from "../../utils/Export";
import * as Action from "../../../actions/Masters/complaintType";
import { bindActionCreators } from "redux";
import { all_sub_ott_list } from "../../../actions/Masters/subott";
export default function ComplaintType() {
  const user = useSelector((state) => state.layout.profile);
  const dispatch = useDispatch();
  const rights = useSelector((state) => state.layout.rights);
  const location = useLocation();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [save, setSave] = useState(false);
  const { complaint_type_create, complaint_type_update } = bindActionCreators(
    Action,
    dispatch
  );

  const [form, setForm] = useState(
    (location?.state?.form && JSON.parse(location?.state?.form)) || {}
  );
  const [view, setView] = useState(location?.state?.view || "view_all");
  useMemo(() => {
    if (isEdit) {
      setView("create_new");
    } else {
      setView("view_all");
      setForm({});
    }
  }, [isEdit]);
  const tempTableData = {
    tableTitle: "Complaint Type",
    deleteRecord: Action.complaint_type_delete,
    updateRecord: Action.complaint_type_status_update,
    onDeleteText: "Are you sure to delete?",
    deleteAccess: rights?.["Masters"]?.["delete"] == "true",
    onUpdateText: "Are you Sure?",
    tableHead: [
      {
        id: "complaint_for",
        label: "Complaint For",
      },
      {
        id: "complaint_type",
        label: "Complaint Type",
      },
      {
        id: "status",
        label: "Status",
      },
      {
        id: "edit",
        label: "Update",
        access: "true",
        isNewPopUpForm: true,
      },
    ],
    tableBody: [],
    filterColumn: [
      {
        id: "1",
        title: "Complaint Type",
        name: "complaint_type",
        options: ["With Login", "With Out Login"],
      },
    ],
  };
  const [tableData, setTableData] = useState({ ...tempTableData });
  useMemo(() => {
    setTableData({ ...tempTableData });
  }, [rights]);
  const complaint_type = useSelector((state) => state?.masters?.complaint_type);
  const sub_ott = useSelector((state) => state?.masters?.sub_ott);
  useMemo(() => {
    dispatch(all_sub_ott_list());
  }, []);
  useEffect(() => {
    if (user?.id) {
      const data = new FormData();
      data.append("id", user?.id);
      data.append("user", user?.id);
      //  if(movies?.statuscode!=200)
      dispatch(Action.complaint_type_list_admin(data));
    }
  }, [user?.id, save]);
  useMemo(() => {
    if (complaint_type) {
      const temp = tableData;
      temp.tableBody = complaint_type?.data;
      setTableData({ ...temp });
    }
  }, [complaint_type]);

  const [formStructure, setFormStructure] = useState(
    [
      {
        type: "select",
        name: "complaint_for",
        title: "Complaint For",
        placeholder: "Select Complaint For",
        options: [
          { label: "With Login", value: "With Login" },
          { label: "With Out Login", value: "With Out Login" },
        ],
        required: true,
      },

      {
        id: "2",
        type: "inputBox",
        title: "Complaint Type",
        name: "complaint_type",
        placeholder: "Type Complation",
        required: true,
      },
      {
        type: "multiselect",
        name: "available_for_ott",
        title: "Available For Ott",
        placeholder: "Enter Available For Ott",
        options: [],
        required: true,
      },
    ].filter((e) => e)
  );

  useMemo(() => {
    if (sub_ott?.data) {
      const temp = formStructure;
      temp[2]["options"] = sub_ott?.data?.map((ele) => ({
        label: ele?.title,
        value: ele?.id,
      }));
      setFormStructure([...temp]);
    }
  }, [sub_ott]);

  const handleSubmit1 = async (event) => {
    // event.preventDefault();
    if (isEdit) {
      const resData = await complaint_type_update(form);
      console.log(resData, "neweweweweweew");
      if (resData?.status === 200) {
        setIsModalOpen(false);
        setSave(!save);
        setForm({});
        // navigate("/masters/category/", { state: { formUpload: true } });
      } else {
        setForm(form);
        // setIsModalOpen(true)
      }
    } else {
      const resData = await complaint_type_create(form);
      if (resData?.status === 200) {
        setForm({});
        setIsModalOpen(false);
        setSave(!save);
        // navigate("/masters/category/", { state: { formUpload: true } });
      } else {
        setForm(form);
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
        formTitle={isEdit ? "Edit Complaint Type" : "Add Complaint Type"}
        onSubmit={handleSubmit1}
        initialData={editingIndex !== null ? tableData[editingIndex] : {}}
        exportButton={
          <Export
            fileName={"Complaint Type"}
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
