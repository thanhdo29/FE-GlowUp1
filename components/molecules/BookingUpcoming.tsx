import { useRouter } from 'expo-router'
import { isNil } from 'lodash'
import React, { useState } from 'react'
import Toast from 'react-native-toast-message'
import { useSelector } from 'react-redux'
import { Text, View } from 'tamagui'

import { request } from '~/apis/HttpClient'
import Loading from '~/components/atoms/Loading'
import AppModal from '~/components/molecules/common/AppModal'
import BookingList from '~/components/organisms/BookingList'
import getColors from '~/constants/Colors'
import { useColorScheme } from '~/hooks/useColorScheme'
import useTranslation from '~/hooks/useTranslation'
import type Appointment from '~/interfaces/Appointment'
import { Status } from '~/interfaces/enum/Status'
import { type RootState } from '~/redux/store'

export interface BookingProps {
  appointments: Appointment[]
  isLoading: boolean
  removeLocalAppointment?: (id: string) => void
  refetch?: () => void
}

const BookingUpcoming = ({
  appointments,
  isLoading,
  removeLocalAppointment
}: BookingProps): React.ReactElement => {
  const { t } = useTranslation()
  const router = useRouter()
  const colors = getColors(useColorScheme().colorScheme)
  const user = useSelector((state: RootState) => state.user.result)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [cancelId, setCancelId] = useState('')

  const pendingAppointments = appointments
    .filter(
      (item) =>
        (item.status === Status.CONFIRMED || item.status === Status.PENDING) &&
        !isNil(item.customer) &&
        item.customer.id === user.id
    )

  const confirmCancelBooking = async (id: string): Promise<void> => {
    try {
      if (isNil(removeLocalAppointment)) return
      removeLocalAppointment(id)
      setIsModalVisible(false)
      const response = await request.get(
        `booking/cancel?phone=${user.phone_number}&booking_id=${cancelId}`
      )
      if (response.success === true) {
        Toast.show({
          position: 'top',
          text1: 'Bạn đã huỷ lịch hẹn thành công!',
          type: 'success'
        })
      } else {
        setIsModalVisible(false)
        Toast.show({
          position: 'top',
          text1: 'Đã có lỗi xảy ra!',
          text2: 'Vui lòng thử lại sau!',
          type: 'error'
        })
      }
    } catch (error) {
      console.error(error)
      Toast.show({
        position: 'top',
        text1: 'Đã có lỗi xảy ra!',
        text2: 'Vui lòng thử lại sau!',
        type: 'error'
      })
    }
    setIsModalVisible(false)
  }

  const viewBooking = (id: string): void => {
    const viewCompletedAppointment = pendingAppointments.filter(
      (item) => item.id === id && item.customer.id === user.id
    )
    router.push({
      params: { bookingData: JSON.stringify(viewCompletedAppointment) },
      pathname: '/checkout/BookingCheckout'
    })
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <View>
      {pendingAppointments.length > 0
        ? (
          <BookingList
            cancellPress={(id) => {
              setIsModalVisible(true)
              setCancelId(id)
            }}
            dataCombo={pendingAppointments}
            visibleTextCancel={false}
            visibleFormButton={true}
            visibleTransparentButton={true}
            viewBookingPress={(id) => {
              viewBooking(id)
            }}
          />
        )
        : (
          <Text color={colors.text}>{t('booking.upcoming')}</Text>
        )}

      <AppModal
        visible={isModalVisible}
        title="Cảnh báo!"
        type="INFO"
        ontClose={() => {
          setIsModalVisible(false)
        }}
        subtitle="Bạn có chắc chắn muốn huỷ lịch hẹn này không?"
        cancelText="Hủy"
        onCancel={() => {
          setIsModalVisible(false)
        }}
        confirmText="Chắc chắn"
        onConfirm={async () => {
          await confirmCancelBooking(cancelId)
        }}
      />
    </View>
  )
}

export default BookingUpcoming
