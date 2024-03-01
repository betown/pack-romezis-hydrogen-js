import {useEffect} from 'react';

import {useCustomerUpdateAddress} from '~/lib/customer';

import {AddressForm} from './AddressForm';

export function EditAddressForm({
  defaultAddress,
  initialAddress,
  setInitialAddress,
}) {
  const {address, errors, status, updateAddress} = useCustomerUpdateAddress();

  useEffect(() => {
    if (address && status.success) {
      setInitialAddress(null);
    }
  }, [address, status.success]);

  const buttonText = 'Update Address';

  return (
    <AddressForm
      buttonText={buttonText}
      closeForm={() => setInitialAddress(null)}
      defaultAddress={defaultAddress}
      errors={errors}
      onSubmit={updateAddress}
      initialAddress={initialAddress}
      status={status}
      title="Edit Address"
    />
  );
}

EditAddressForm.displayname = 'EditAddressForm';
