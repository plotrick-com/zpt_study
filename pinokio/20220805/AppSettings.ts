import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script';
import VehicleData from './VehicleData';

export default class AppSettings extends ZepetoScriptBehaviour
{
    @SerializeField() private vehicles : ZepetoScriptableObject<VehicleData>[];
}
