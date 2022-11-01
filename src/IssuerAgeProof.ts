import {
  state,
  State,
  method,
  PublicKey,
  Field,
  SmartContract,
  Poseidon,
} from 'snarkyjs';

export { IssuerAgeProof_ };

class IssuerAgeProof_ extends SmartContract {
  @state(PublicKey) stateAddress = State<PublicKey>();

  readonly ageToProve = 18;
  readonly personalEncryptedAge =
    Field.fromBigInt(
      21294934938834819506687011406629737744121517272917194830529619446796258228081n
    );

  @method giveAnswer(answer: Field, address: PublicKey) {
    // Compute hash chain by going [ageToProve] steps over the user's answer
    let hashChainValue = answer;
    for (let i = 0; i < this.ageToProve; ++i) {
      hashChainValue = Poseidon.hash([hashChainValue]);
    }

    // personalEncryptedAge (age encryption provided by the identity issuer)
    // Check if the the user's answer is truthful and proves age > [ageToProve].
    hashChainValue.assertEquals(this.personalEncryptedAge);

    // If the true age is < [ageToProve], assertion will fail
    // even if the user provided an answer calculated
    // by true credentials.

    // If the assertion passes, update the zkApp's state.
    // New state is the public key of the account who sent the right answer.
    const stateAddress = this.stateAddress.get();
    this.stateAddress.assertEquals(stateAddress);
    this.stateAddress.set(address);
  }
}
