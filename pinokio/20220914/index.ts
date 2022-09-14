import * as Server from "ZEPETO.Multiplay";
import * as IO from "ZEPETO.Multiplay.DataStorage";
import * as Schema from "ZEPETO.Multiplay.Schema";
import Settings from "./APP_Settings";
import * as RoomStateMachine from './FSM_Room';
//import * as PlayerStateMachine from './FSM_Player';
//import * as CharacterStateMachine from './FSM_Character';

import RoomGamePlayState from "./FSM_Room_GamePlay";
import RoomGameSetState from "./FSM_Room_GameSet";
import RoomInitState from "./FSM_Room_Init";
import RoomIntermissionState from "./FSM_Room_Intermission";
import RoomResultState from "./FSM_Room_Result";
import RoomTimeOutState from "./FSM_Room_TimeOut";


export default class extends Server.Sandbox
{
    private settings : Settings = null;
    public get Settings() : Settings { return this.settings; }

    private database : Map<string, IO.DataStorage> = null;
    public get Database() : Map<string, IO.DataStorage> { return this.database; }

    private room : RoomStateMachine.StateMachine = null;
    public get Room() : RoomStateMachine.StateMachine { return this.room; }

    constructor()
    {
        super();
    }

    onCreate(options: Server.SandboxOptions)
    {
        this.settings = new Settings();
        this.database  = new Map<string, IO.DataStorage>();
        this.room = new RoomStateMachine.StateMachine(
            this,
            [
                new RoomInitState(),
                new RoomIntermissionState(),
                new RoomGamePlayState(),
                new RoomGameSetState(),
                new RoomTimeOutState(),
                new RoomResultState(),    
            ],
            RoomStateMachine.StateID.Intermission
        );

        this.onMessage("OnPlayerPStateChanged", this.OnPlayerPStateChanged);
        this.onMessage("OnPlayerTransformChanged", this.OnPlayerTransformChanged);
        this.onMessage("OnPlayerCStateChanged", this.OnPlayerCStateChanged);
        this.onMessage("OnPlayerAStateChanged", this.OnPlayerAStateChanged);
        this.onMessage("OnPlayerVehicleChanged", this.OnPlayerVehicleChanged);
        
    }

    async onJoin(client: Server.SandboxPlayer)
    {
        console.log(`[OnJoin] client.sessionId = ${client.sessionId}`);

        // 플레이어 스키마를 생성/추가한다.
        const player = new Schema.Player();
        player.sessionId = client.sessionId;
        if (client.hashCode) player.zepetoHash = client.hashCode;
        if (client.userId) player.zepetoUserId = client.userId;
        this.state.players.set(player.sessionId, player);

        // 플레이어 스토리지를 생성/추가한다.
        const storage = client.loadDataStorage();
        this.database.set(player.sessionId, storage);

        // 플레이어 스토리지 : 탈것 인덱스
        player.vIndex = await storage.get("vIndex") as number ?? 0;
    }

    OnPlayerPStateChanged(client : Server.SandboxPlayer, message : any)
    {
        if (!this.state.players.has(client.sessionId))
        {
            console.error(`[OnPlayerPStateChanged] player not found : ${client.sessionId}`);
            return;
        }

        const player = this.state.players.get(client.sessionId);
        player.pState = message.pState;
    }

    OnPlayerTransformChanged(client : Server.SandboxPlayer, message : any)
    {
        if (!this.state.players.has(client.sessionId))
        {
            console.error(`[OnPlayerPStateChanged] player not found : ${client.sessionId}`);
            return;
        }

        const player = this.state.players.get(client.sessionId);

        const cRot = new Schema.Vector3();
        cRot.x = message.cRot.x;
        cRot.y = message.cRot.y;
        cRot.z = message.cRot.z;

        const cPos = new Schema.Vector3();
        cPos.x = message.cPos.x;
        cPos.y = message.cPos.y;
        cPos.z = message.cPos.z;

        player.cRot = cRot;
        player.cPos = cPos;

        console.log(`player transform updated : cRot(${cRot.x.toFixed(1)},${cRot.y.toFixed(1)},${cRot.z.toFixed(1)}), cPos(${cPos.x.toFixed(1)},${cPos.y.toFixed(1)},${cPos.z.toFixed(1)})`);
        
    }

    OnPlayerCStateChanged(client : Server.SandboxPlayer, message : any)
    {
        if (!this.state.players.has(client.sessionId))
        {
            console.error(`[OnPlayerPStateChanged] player not found : ${client.sessionId}`);
            return;
        }

        const player = this.state.players.get(client.sessionId);
        player.cState = message.cState;
    }

    OnPlayerAStateChanged(client : Server.SandboxPlayer, message : any)
    {
        if (!this.state.players.has(client.sessionId))
        {
            console.error(`[OnPlayerPStateChanged] player not found : ${client.sessionId}`);
            return;
        }

        const player = this.state.players.get(client.sessionId);
        player.aState = message.aState;
    }

    async OnPlayerVehicleChanged(client : Server.SandboxPlayer, message : any)
    {
        if (!this.state.players.has(client.sessionId))
        {
            console.error(`[OnPlayerPStateChanged] player not found : ${client.sessionId}`);
            return;
        }

        const player = this.state.players.get(client.sessionId);
        player.vIndex = message.vIndex;
        await this.Database.get(player.sessionId).set("vIndex", player.vIndex);
    }

    async onLeave(client: Server.SandboxPlayer, consented?: boolean)
    {
        console.log(`[OnLeave] client.sessionId = ${client.sessionId}`);

        this.state.players.delete(client.sessionId);
        this.database.delete(client.sessionId);
    }

    onTick(deltaTime: number): void
    {
    }
}
