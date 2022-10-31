import {
  state,
  State,
  method,
  PublicKey,
  Field,
  SmartContract,
  Poseidon,
} from 'snarkyjs';

export { OracleAgeProof_ };

class OracleAgeProof_ extends SmartContract {
  @state(PublicKey) stateAddress = State<PublicKey>();

  @method giveAnswer(answer: Field, address: PublicKey) {
    const ageToProve = 18;

    let hashChainValue = answer;

    for (let i = 0; i < ageToProve; ++i) {
      hashChainValue = Poseidon.hash([hashChainValue]);
    }

    // solution (age encryption procided by the oracle)
    // check if the provided age is true
    let solution =
      Field.fromBigInt(
        21294934938834819506687011406629737744121517272917194830529619446796258228081n
      );

    hashChainValue.assertEquals(solution);

    // if assertion passes, update state
    let value_ = this.stateAddress.get();
    this.stateAddress.assertEquals(value_);
    this.stateAddress.set(address);
  }
}
