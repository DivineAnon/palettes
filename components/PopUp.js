import { useSelector } from "react-redux";
import { selectDataAddToFav, selectDataCodePopup, selectDataDeleteCollection, selectDataDeleteColor, selectDataDeleteGradient, selectDataDeleteProject, selectDataDetailPalette, selectDataExportPalette, selectDataExportPaletteAsImg, selectDataFullscreenPalette, selectDataMenuMore, selectDataPopupCollection, selectDataPopupGradient, selectDataPopupLuminance, selectDataPopupProject, selectDataPopupViewGradient, selectDataQuickView, selectDataShowCSSGradient, selectDataShowGenerateMethod, selectDataShowSettingPalette, selectDataShowUploadImage, selectDataSingleQuickView, selectDeletePalette, selectLoginRes, selectSaveColor, selectSavePalette } from "../slices/popupSlice";
import CodePopup from "./CodePopup";
import ExportPaletteAsImg from "./ExportPaletteAsImg";
import ExportPalettePopup from "./ExportPalettePopup";
import FullscreenPalette from "./FullscreenPalette";
import GenerateMethod from "./GenerateMethod";
import GradientPopup from "./GradientPopup";
import LoginPopup from "./LoginPopup";
import LoginRes from "./LoginRes";
import LuminancePopup from "./LuminancePopup";
import MenuRelative from "./MenuRelative";
import PopupAddToFav from "./PopupAddToFav";
import PopupCreateCollection from "./PopupCreateCollection";
import PopupCreateProject from "./PopupCreateProject";
import PopupCSSGradient from "./PopupCSSGradient";
import PopupDeleteCollection from "./PopupDeleteCollection";
import PopupDeleteColor from "./PopupDeleteColor";
import PopupDeleteGradient from "./PopupDeleteGradient";
import PopupDeletePalette from "./PopupDeletePalette";
import PopupDeleteProject from "./PopupDeleteProject";
import PopupPaletteDetail from "./PopupPaletteDetail";
import PopupSaveColor from "./PopupSaveColor";
import PopupSaveGradient from "./PopupSaveGradient";
import PopupSavePalette from "./PopupSavePalette";
import PopupUploadImg from "./PopupUploadImg";
import QuickView from "./QuickView";
import RegisterPopup from "./RegisterPopup";
import ResetPassword from "./ResetPassword";
import SettingsPalette from "./SettingsPalette";
import SingleQuickView from "./SingleQuickView";

export default function PopUp(){
    const dataSaveColor = useSelector(selectSaveColor);
    const loginRes = useSelector(selectLoginRes);
    const savePalette = useSelector(selectSavePalette);
    const deletePalette = useSelector(selectDeletePalette);
    const dataPopupProject = useSelector(selectDataPopupProject);
    const dataDeleteProject = useSelector(selectDataDeleteProject);
    const dataDeleteColor = useSelector(selectDataDeleteColor);
    const dataPopupCollection = useSelector(selectDataPopupCollection);
    const dataDeleteCollection = useSelector(selectDataDeleteCollection);
    const dataSaveGradient = useSelector(selectDataPopupGradient);
    const dataDeleteGradient = useSelector(selectDataDeleteGradient);
    const dataQuickView = useSelector(selectDataQuickView);
    const dataExportPalette = useSelector(selectDataExportPalette);
    const dataCodePopup = useSelector(selectDataCodePopup);
    const dataExportPaletteAsImg = useSelector(selectDataExportPaletteAsImg);
    const dataPopupViewGradient = useSelector(selectDataPopupViewGradient);
    const dataShowCSSGradient = useSelector(selectDataShowCSSGradient);
    const dataShowSettingPalette = useSelector(selectDataShowSettingPalette);
    const dataShowGenerateMethod = useSelector(selectDataShowGenerateMethod);
    const dataPopupLuminance = useSelector(selectDataPopupLuminance);
    const dataSingleQuickView = useSelector(selectDataSingleQuickView);
    const dataShowUploadImage = useSelector(selectDataShowUploadImage);
    const dataFullscreenPalette = useSelector(selectDataFullscreenPalette);
    const dataMenuMore = useSelector(selectDataMenuMore);
    const dataDetailPalette = useSelector(selectDataDetailPalette);
    const dataAddToFav = useSelector(selectDataAddToFav);
    return (
        <>
         {loginRes.provider && (
            <LoginRes/>
         )}
         {loginRes.login && (
             <LoginPopup/>
         )}
         {loginRes.register && (
             <RegisterPopup/>
         )}
         {loginRes.reset && (
             <ResetPassword/>
         )}
         {dataQuickView && (
             <QuickView/>
         )}
         {dataShowSettingPalette && (
             <SettingsPalette/>
         )}
         {dataPopupViewGradient && (
             <GradientPopup/>
         )}
         {dataExportPalette && (
             <ExportPalettePopup/>
         )}
         {dataPopupLuminance && (
             <LuminancePopup/>
         )}
         {dataCodePopup && (
             <CodePopup/>
         )}
         {dataExportPaletteAsImg && (
             <ExportPaletteAsImg/>
         )}
         {dataShowGenerateMethod && (
             <GenerateMethod/>
         )}
         {dataSingleQuickView && (
             <SingleQuickView/>
         )}
         {dataShowUploadImage && (
            <PopupUploadImg/>
         )}
         {savePalette && (
            <PopupSavePalette/>
         )}
         {dataPopupProject && (
            <PopupCreateProject/>
         )}
         {dataPopupCollection && (
            <PopupCreateCollection/>
         )}
         {dataDeleteProject && (
            <PopupDeleteProject/>
         )}
         {dataDeleteCollection && (
            <PopupDeleteCollection/>
         )}
         {deletePalette && (
            <PopupDeletePalette/>
         )}
         {dataShowCSSGradient && (
            <PopupCSSGradient/>
         )}
         {dataFullscreenPalette && (
            <FullscreenPalette/>
         )}
         {dataMenuMore && (
            <MenuRelative/>
         )}
         {dataSaveGradient && (
            <PopupSaveGradient/>
         )}
         {dataSaveColor && (
            <PopupSaveColor/>
         )}
         {dataDeleteColor && (
            <PopupDeleteColor/>
         )}
         {dataDeleteGradient && (
            <PopupDeleteGradient/>
         )}
         {dataDetailPalette && (
            <PopupPaletteDetail/>
         )}
         {dataAddToFav && (
            <PopupAddToFav/>
         )}
        </>
    )
}