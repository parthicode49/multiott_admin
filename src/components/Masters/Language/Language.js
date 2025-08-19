import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListTable from "../../utils/Table";
import { useLocation, useNavigate } from "react-router-dom";
import ViewChangeForm from "../../utils/ViewChangeForm";
// import {
//   language_delete,
//   language_update,
//   all_language_list,
//   language_status_update,
// } from "../../../actions/Masters/language";
import * as Action from "../../../actions/Masters/language"
import Export from "../../utils/Export";
import { bindActionCreators } from "redux";
import { all_sub_ott_list } from "../../../actions/Masters/subott";

const Language = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();
  const location = useLocation();
  const role = useSelector((state) => state.layout.role);
  const rights = useSelector((state) => state.layout.rights);
 const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [save, setSave] = useState(false);
  const user = useSelector((state) => state.layout.profile);
  const language = useSelector((state) => state?.masters?.languages);
    const sub_ott = useSelector((state) => state?.masters?.sub_ott);
  // const categories = useSelector((state) => state.masters.categories);
  // const subcategories = useSelector((state) => state.masters.subcategories);
  // const genre = useSelector((state) => state.masters.genre);
  // const language = useSelector((state) => state.masters.languages);
  const [form, setForm] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const {language_create , language_update} = bindActionCreators(Action , dispatch)
  const [tableData, setTableData] = useState({
    tableTitle: "Languages",
    deleteRecord: Action.language_delete,
    updateRecord: Action.language_status_update,
    deleteAccess: rights?.["Masters"]?.["delete"] == "true",
    onDeleteText: "Are you sure want to delete?",
    onUpdateText: "Are you Sure?",
    tableHead: [
      {
        id: "language_name",
        label: "Language",
      },
      {
        id: "status",
        label: "Status",
      },
      // {
      // 	id: "language_image",
      // 	label: "Image",
      // 	isImage: true
      // },

      {
        id: "edit",
        label: "Update",
        access: rights?.["Masters"]?.["edit"] == "true",
           isNewPopUpForm : true
      },
    ],
    tableBody: [],
    // isDateRangeFilter: "created_at",
  });

  useEffect(() => {
    if (user?.id) {
      const data = new FormData();
      data.append("id", user?.id);
      data.append("user", user?.id);
      //  if(movies?.statuscode!=200)
      dispatch(Action.all_language_list(data));
    }
  }, [user?.id , save]);
    useMemo(() => {
      dispatch(all_sub_ott_list());
    }, []);
  useEffect(() => {
    if (location?.state?.formUpload) {
      const data = new FormData();
      data.append("id", user?.id);
      data.append("user", user?.id);
      //  if(movies?.statuscode!=200)
      dispatch(Action.all_language_list(data));
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location]);
  useMemo(() => {
    if (language) {
      const temp = tableData;
      temp.tableBody = language?.data;
      setTableData({ ...temp });
    }
  }, [language]);
  const handleSubmit1 = async (event) => {
    // event.preventDefault();
    if (isEdit) {
      const resData = await language_update(form);
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
      const resData = await language_create(form);
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

  const [formStructure , setFormStructure] = useState([
    {
      type: "inputBox",
      name: "language_name",
      title: "Add Language",
      placeholder: "Enter Language Name",
      regex: /^[a-zA-Z\s\&]+$/,
      required: true,
    },
     {
        type: "multiselect",
        name: "available_for_ott",
        title: "Available For Ott",
        placeholder: "Select Available For Ott",
        options: [],
        required: true,
      },
   
  ].filter((e) => e))

  useMemo(() => {
    if (sub_ott?.data) {
      const temp = formStructure;
      temp[1]["options"] = sub_ott?.data?.map((ele) => ({
        label: ele?.title,
        value: ele?.id,
      }));
      setFormStructure([...temp]);
    }
  }, [sub_ott]);
  return (
    <div>
      {/* <div style={{textAlign:"right"}}>
         <Button
          startIcon={<AddIcon sx={{ color: '#fff !important' }} />}
          variant="contained"
          color="success"
          sx={{
            textTransform: 'capitalize',
            borderRadius: '10px',
            mt: '10px',
            p: '10px 30px',
            fontSize: '14px',
            color: '#fff !important',
          }}
          style={{ background: "linear-gradient(225deg,  var(--gradientColor1) 0%, var(--gradientColor2) 91.25%)" }}
          className="mr-10px"
          onClick={() => navigate("/movie_testing/create_movie_testing/" )}
        >
          Add
        </Button>
        </div> */}
      {/* <ViewChangeForm
        create_new={"/masters/language/createlanguage/"}
        access={true}
        view="create_new"
        export_excel={
          <Export
            fileName={"Language"}
            isClubed={true}
            access={"true"}
            exportData={tableData?.exportData || tableData?.tableBody}
            headings={tableData.tableHead?.map((value) => value.label)}
            // api = {"export_episode_list"}
            // api_data = {episodes?.filter_condition}
          />
        }
      /> */}

      <ListTable
        tableData={tableData}
        key={"ListTable"}
        form={form}
        setForm={setForm}
        setTableData={setTableData}
        setIsEdit={setIsEdit}
        view="view_all"
        create_new={"/masters/language/editlanguage/"}
        save={save}
        setSave={setSave}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isPopUpNewTable={true}
        formStructure={formStructure}
        formTitle={isEdit ? "Edit Language" : "Add Language"}
        onSubmit={handleSubmit1}
        initialData={editingIndex !== null ? tableData[editingIndex] : {}}
        exportButton={
          <Export
            fileName={"Language"}
            isClubed={true}
            access={"true"}
            exportData={tableData?.exportData || tableData?.tableBody}
            headings={tableData.tableHead?.map((value) => value.label)}
            // api = {"export_episode_list"}
            // api_data = {episodes?.filter_condition}
          />
        }
      />
    </div>
  );
};

export default Language;
