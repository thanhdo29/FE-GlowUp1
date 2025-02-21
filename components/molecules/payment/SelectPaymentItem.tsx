import { useColorScheme } from 'react-native'
import { Image, RadioGroup, Text, View, XStack, type XStackProps } from 'tamagui'

import getColors from '~/constants/Colors'

type PaymentMethodItemProps = {
  bankName: string
  bankImage: string
  value: string
} & XStackProps

const PaymentMethodItem = ({
  bankName,
  bankImage,
  value,
  ...props
}: PaymentMethodItemProps): React.ReactElement => {
  const colors = getColors(useColorScheme())

  return (
    <XStack
      {...props}
      justifyContent="space-between"
      alignItems="center"
      backgroundColor={colors.white}
      padding={10}
      marginVertical={8}
      borderRadius={8}
      borderWidth={1}
      borderColor={colors.gray}>
      <XStack alignItems="center" flex={1}>
        <RadioGroup.Item
          id={value}
          value={value}
          marginRight={10}
          backgroundColor="$colorTransparent"
          borderColor={colors.radioColor}>
          <RadioGroup.Indicator backgroundColor={colors.radioColor} />
        </RadioGroup.Item>
        <Text fontSize={14} fontWeight="500" flexShrink={1} color={colors.text}>
          {bankName}
        </Text>
      </XStack>

      <View flex={0} borderRadius={7} borderColor={colors.gray} borderWidth={1}>
        <Image
          source={{
            uri: bankImage
          }}
          width={50}
          height={30}
          resizeMode="contain"
        />
      </View>
    </XStack>
  )
}

export default PaymentMethodItem
