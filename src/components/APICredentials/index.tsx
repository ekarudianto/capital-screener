import './APICredentials.css';

export default function APICredentials(props: any) {

  return (
    <div className='APICredentials'>
      <input
        type='text'
        name='securityToken'
        placeholder='security token'
        onChange={e => props.updateSecurityToken(e.target.value)}
        style={{
          'marginRight': '10px',
        }}
      />

      <input
        type='text'
        name='cst'
        placeholder='cst'
        onChange={e => props.updateCst(e.target.value)}
      />
    </div>
  );
}
