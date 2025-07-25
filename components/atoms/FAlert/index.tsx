import { View } from "react-native";
import { Portal, Snackbar, SnackbarProps } from "react-native-paper";
import { theme } from "../../../ui";

export enum AlertMessageColor {
  Success = "green",
  Error = "red",
  Warning = "yellow",
  Info = "blue",
}

export interface FAlertModel {
  textAlert: string;
  type: AlertMessageColor;
  options?: SnackbarProps;
}

const alertMessageColors = {
  [AlertMessageColor.Success]: theme.colors.success[400],
  [AlertMessageColor.Error]: theme.colors.error[400],
  [AlertMessageColor.Warning]: theme.colors.warning[400],
  [AlertMessageColor.Info]: theme.colors.info[400],
};

export function FAlert(props: FAlertModel) {
  return (
    <View>
      <Portal>
        <Snackbar
          visible={props.options?.visible!}
          onDismiss={() => props.options?.onDismiss()}
          {...props.options}
          style={{
            display: props.options?.visible ? "flex" : "none",
            backgroundColor: alertMessageColors[props.type],
            position: "relative",
            top: 0,
            left: 0,
            marginBottom: 680,
          }}
        >
          {props.textAlert}
        </Snackbar>
      </Portal>
    </View>
  );
}
