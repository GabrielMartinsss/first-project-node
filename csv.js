import assert from 'assert';
import { generate } from 'csv-generate';
import { parse } from 'csv-parse';

(async () => {
  // Initialise the parser by generating random records
  const parser = generate({
    task: 'task',
    description: 'description',
    length: 10
  }).pipe(
    parse()
  );

  let count = 0;
  const url = "http://localhost:3335/tasks"

  process.stdout.write('start\n');

  for await (const record of parser) {
    const body = {
      title: `${record.title = `Task ${count}`}`,
      description: `${record.description = `Descriçao da Task ${count}`}`
    }

    process.stdout.write(`${record.title = `Task ${count}`} ${record.description = `Descriçao da Task ${count}`}\n`);

    count++

    await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })
  }
  // Report end
  process.stdout.write('...done\n');
  // Validation
  assert.strictEqual(count, 10);
})();