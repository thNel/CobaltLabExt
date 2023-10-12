import {ReactElement, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {WorkerSettings} from "@/types/workerSettings";
import ToastUtils from "@/utils/toastUtils";
import Input from "@mui/material/Input";
import {ResourceTypes} from "@/types/resourceTypes";
import {availableToDelete} from "@/store";
import Box from "@mui/material/Box";
import Port = chrome.runtime.Port;

const ACSettings = (): ReactElement => {
  const [port, setPort] = useState<Port | null>(null);
  const [pending, setPending] = useState(false);
  const [settingsACS, setSettingsACS] = useState<WorkerSettings['acs']>({
    autoSelectTool: false,
    autoRepairTool: false,
    autoDeleteTool: false,
    delay: 200,
    deleteList: [],
  });

  const updSettingsACS = (partial: Partial<WorkerSettings['acs']>) => {
    setSettingsACS({
      ...settingsACS,
      ...partial
    });
    return {
      ...settingsACS,
      ...partial
    };
  }

  const updDeleteList = (key: number) => {
    if (settingsACS.deleteList.some(item => item === key)) {
      const current = updSettingsACS({deleteList: settingsACS.deleteList.filter(item => item !== key)});
      saveSettings(current);
      return;
    }
    const current = updSettingsACS({deleteList: [...settingsACS.deleteList, key]});
    saveSettings(current);
  }

  const listener = (msg: any) => {
    setPending(true);
    if (typeof msg === "string") {
      ToastUtils.info(msg, {autoHideDuration: 500});
    }
    if (msg.acs) {
      if (JSON.stringify(Object.keys(settingsACS).sort()) === JSON.stringify(Object.keys(msg.acs).sort())) {
        updSettingsACS(msg.acs);
      } else {
        ToastUtils.error('Не верная схема настроек автокликера в ответе от игры!');
      }
    } else {
      console.log(msg);
    }
    setPending(false);
  };

  useEffect(() => {
    chrome.runtime.onConnect.addListener((_port) => {
      setPort(_port);
      _port.onMessage.addListener(listener);
      _port.postMessage({get: 'acs'});
    });
    chrome.tabs.query({active: true, currentWindow: true}).then(([tab]) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, 'CobaltLab Helper ping')
          .catch(e => ToastUtils.error(String(e?.message ?? e)));
      }
    });
  }, []);

  const saveSettings = (current: WorkerSettings['acs']) => {
    if (!port) {
      ToastUtils.error('Нет соединения с игрой!');
      return;
    }
    port.postMessage({set: {acs: current}});
  }


  return (
    <>
      <Box
        sx={{
          paddingTop: '15px',
          paddingLeft: '6px',
          gap: '10px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
        }}
      >

        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'end'
          }}
        >
          <Typography>Автоматический выбор инструмента</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Button
            variant={settingsACS.autoSelectTool ? 'contained' : 'outlined'}
            sx={{minWidth: '73px'}}
            disabled={pending}
            onClick={async () => {
              const current = updSettingsACS({autoSelectTool: !settingsACS.autoSelectTool});
              saveSettings(current);
            }}
          >
            {settingsACS.autoSelectTool ? 'Вкл' : 'Выкл'}
          </Button>
        </Box>

        {settingsACS.autoSelectTool &&
          <>
            <Box
              sx={{
                display: 'flex',
                flex: '1 1 auto',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'end'
              }}
            >
              <Typography>Починка камня</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flex: '1 1 auto',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Button
                variant={settingsACS.autoRepairTool ? 'contained' : 'outlined'}
                sx={{minWidth: '73px'}}
                disabled={pending}
                onClick={() => {
                  const current = updSettingsACS({autoRepairTool: !settingsACS.autoRepairTool});
                  saveSettings(current);
                }}
              >
                {settingsACS.autoRepairTool ? 'Вкл' : 'Выкл'}
              </Button>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flex: '1 1 auto',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'end'
              }}
            >
              <Typography>Удаление сломанных инструментов</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flex: '1 1 auto',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Button
                variant={settingsACS.autoDeleteTool ? 'contained' : 'outlined'}
                sx={{minWidth: '73px'}}
                disabled={pending}
                onClick={async () => {
                  const current = updSettingsACS({autoDeleteTool: !settingsACS.autoDeleteTool});
                  saveSettings(current);
                }}
              >
                {settingsACS.autoDeleteTool ? 'Вкл' : 'Выкл'}
              </Button>
            </Box>
          </>
        }

        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'end'
          }}
        >
          <Typography>Минимальная задержка кликов</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Input
            sx={{width: '73px'}}
            value={settingsACS.delay}
            disabled={pending}
            inputProps={{
              maxLength: 3,
              style: {textAlign: "center"}
            }}
            onChange={(event) => {
              if (event.target.value.length === 0) {
                const current = updSettingsACS({delay: 1});
                saveSettings(current);
                return;
              }
              if (isNaN(+event.target.value) || event.target.value.includes('.') || event.target.value.includes(',') || +event.target.value < 0) {
                ToastUtils.error('Только целые числа!');
                return;
              }
              const current = updSettingsACS({delay: parseInt(event.target.value)});
              saveSettings(current);
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '35px',
          marginBottom: '10px',
          marginLeft: '6px',
        }}
      >
        <Typography sx={{alignSelf: 'start'}}> Удалять предметы перед переходом на другую клетку: </Typography>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            maxWidth: '85%',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '20px',
          }}
        >
          {availableToDelete.map((key) => (
            <Box
              key={key}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1',
                padding: '5px',
                backgroundColor: settingsACS.deleteList.some(
                  item => item === key
                )
                  ? 'rgba(153, 51, 51, 0.3)'
                  : '',
              }}
            >
              <img
                src={`/images/resources/${ResourceTypes[key]}.png`}
                style={{
                  cursor: 'pointer',
                }}
                alt={ResourceTypes[key]}
                height={60}
                onClick={() => {
                  updDeleteList(key)
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default ACSettings;